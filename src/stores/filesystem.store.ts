import {get, set} from 'idb-keyval';
import {BehaviorSubject} from "rxjs";

export type FSDirectory = { title: any, name: string, isLeaf: false, key: string, kind: 'directory', children: (FSDirectory | FSFile)[], handle: FileSystemDirectoryHandle };
export type FSFile = { title: any, name: string, isLeaf: true, key: string, kind: 'file', handle: FileSystemFileHandle, allowDrop: false, parent: FSDirectory };

class FilesystemStore {

  public onProjectDirectoryChanged = new BehaviorSubject<FileSystemDirectoryHandle | null>(null);
  public onSavedProjectDirectoryAccess = new BehaviorSubject(false);

  public onFilesystemTreeChanged = new BehaviorSubject<FSDirectory | null>(null);

  constructor() {
    get('project_directory')
      .then(dh => {
        if (dh) {
          this.onProjectDirectoryChanged.next(dh);
        }
      })
  }

  continueProject() {
    const directoryHandle = this.onProjectDirectoryChanged.getValue();
    if (!directoryHandle) {
      return;
    }

    directoryHandle.requestPermission({mode: 'readwrite'})
      .then((r: string) => {
        if (r === 'granted') {
          this.onSavedProjectDirectoryAccess.next(true);
          this.loadFilesystemTree();
        }
      })
  }

  openDirectory() {
    const projectHandle = window.showDirectoryPicker();

    projectHandle.then((handle: any) => {
      set('project_directory', handle);

      this.onProjectDirectoryChanged.next(handle);
      this.onSavedProjectDirectoryAccess.next(true);

      this.loadFilesystemTree();
    });
  }

  loadFilesystemTree() {
    const projectDirectory = this.onProjectDirectoryChanged.getValue();
    const hasAccess = this.onSavedProjectDirectoryAccess.getValue();

    if (!hasAccess || !projectDirectory) {
      return;
    }

    this.listDirectoryTree(projectDirectory, '')
      .then((dt: FSDirectory) => {
        this.onFilesystemTreeChanged.next(dt);
      });
  }

  private async listDirectoryTree(directoryHandle: FileSystemDirectoryHandle, keyPrefix: string): Promise<FSDirectory> {
    const dir: FSDirectory = {
      title: directoryHandle.name,
      name: directoryHandle.name,
      key: `${keyPrefix}/${directoryHandle.name}`,
      isLeaf: false,
      kind: 'directory',
      children: [],
      handle: directoryHandle
    };

    for await (const value of directoryHandle.values()) {
      if (value.name[0] === '.') {
        continue;
      }

      if (value.kind === 'directory') {
        dir.children.push(await this.listDirectoryTree(await directoryHandle.getDirectoryHandle(value.name), `${keyPrefix}/${directoryHandle.name}`));
      }

      if (value.kind === 'file') {
        const f: FSFile = {
          title: value.name,
          name: value.name,
          key: `${keyPrefix}/${directoryHandle.name}/${value.name}`,
          isLeaf: true,
          allowDrop: false,
          kind: 'file',
          handle: await directoryHandle.getFileHandle(value.name),
          parent: dir
        }
        dir.children.push(f);

      }
    }

    dir.children.sort((a, b) => a.kind.localeCompare(b.kind) || a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    return dir;

  }

  async getFileContent(fsfile: FSFile) {
    const file = await fsfile.handle.getFile();
    return await file.text();
  }

  async writeToFile(fsfile: FSFile, content: string) {
    const writable = await fsfile.handle.createWritable();
    await writable.write(content);
    await writable.close();
  }

  async deleteFile(fsfile: FSFile, doNotAsk?: boolean) {
    const root = this.onFilesystemTreeChanged.getValue();

    if (!root) {
      return;
    }

    if (!doNotAsk) {
      const areYouSure = confirm(`Are you sure you want to delete ${fsfile.name}?`);
      if (!areYouSure) {
        return;
      }
    }

    fsfile.parent.handle.removeEntry(fsfile.name);

    this.loadFilesystemTree();
  }

  async createFile(directory: FSDirectory, filename?: string, skipUpdate?: boolean) {
    const root = this.onFilesystemTreeChanged.getValue();

    if (!root) {
      return;
    }

    let fileName: string | null | undefined = filename;

    if (!fileName) {
      fileName = prompt("Please, input file name");
    }

    if (!fileName || directory.children.find(c => c.name.toLowerCase() === fileName!.toLowerCase())) {
      return;
    }

    const file = await directory.handle.getFileHandle(fileName, {create: true});

    const fsfile: FSFile = {
      title: fileName,
      name: fileName,
      key: `${directory.key}/${fileName}`,
      isLeaf: true,
      kind: 'file',
      handle: file,
      allowDrop: false,
      parent: directory
    };

    directory.children = [...directory.children, fsfile].sort((a, b) => a.kind.localeCompare(b.kind) || a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    if (!skipUpdate) {
      this.loadFilesystemTree();
    }

    return fsfile;
  }

  async createDirectory(directory: FSDirectory, name?: string, skipUpdate?: boolean) {
    const root = this.onFilesystemTreeChanged.getValue();

    if (!root) {
      return;
    }

    let dirName: string | null | undefined = name;

    if (!dirName) {
      dirName = prompt("Please, input file name");
    }

    if (!dirName || directory.children.find(c => c.name.toLowerCase() === dirName!.toLowerCase())) {
      return;
    }

    const dir = await directory.handle.getDirectoryHandle(dirName, {create: true});

    const fsdir: FSDirectory = {
      title: dirName,
      name: dirName,
      key: `${directory.key}/${dirName}`,
      kind: 'directory',
      handle: dir,
      isLeaf: false,
      children: []
      // parent: directory
    };

    directory.children = [...directory.children, fsdir].sort((a, b) => a.kind.localeCompare(b.kind) || a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    if (!skipUpdate) {
      this.loadFilesystemTree();
    }

    return fsdir;
  }

  async renameFile(fsfile: FSFile) {
    const root = this.onFilesystemTreeChanged.getValue();

    if (!root) {
      return;
    }

    const fileName = prompt("Please, input file name", fsfile.name);

    if (!fileName || fsfile.parent.children.find(c => c.name.toLowerCase() === fileName.toLowerCase())) {
      return;
    }

    const file = await this.createFile(fsfile.parent, fileName, true);

    if (file) {
      await this.writeToFile(file, await this.getFileContent(fsfile));
      await this.deleteFile(fsfile, true);
      this.loadFilesystemTree();
    }

    return file;
  }

}

export const filesystemStore = new FilesystemStore();

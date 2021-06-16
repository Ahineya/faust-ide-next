import {get, set} from 'idb-keyval';
import {BehaviorSubject} from "rxjs";

export type FSDirectory = {title: string, isLeaf: false, key: string, kind: 'directory', children: (FSDirectory | FSFile)[], handle: FileSystemDirectoryHandle};
export type FSFile = {title: string, isLeaf: true, key: string, kind: 'file', handle: FileSystemFileHandle, allowDrop: false};

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
        console.log(dt);
        this.onFilesystemTreeChanged.next(dt);
      })
  }

  private async listDirectoryTree(directoryHandle: FileSystemDirectoryHandle, keyPrefix: string): Promise<FSDirectory> {
    const dir: FSDirectory = {title: directoryHandle.name, key: `${keyPrefix}/${directoryHandle.name}`, isLeaf: false, kind: 'directory', children: [], handle: directoryHandle};

    for await (const value of directoryHandle.values()) {
      if (value.name[0] === '.') {
        continue;
      }

      if (value.kind === 'directory') {
        dir.children.push(await this.listDirectoryTree(await directoryHandle.getDirectoryHandle(value.name), `${keyPrefix}/${directoryHandle.name}`));
      }

      if (value.kind === 'file') {
        const f: FSFile = {title: value.name, key: `${keyPrefix}/${value.name}`, isLeaf: true, kind: 'file', handle: await directoryHandle.getFileHandle(value.name), allowDrop: false}
        dir.children.push(f);
      }
    }

    return dir;

  }

  async getFileContent(fsfile: FSFile) {
    const file = await fsfile.handle.getFile();
    const contents = await file.text();
    return contents;
  }
}

export const filesystemStore = new FilesystemStore();

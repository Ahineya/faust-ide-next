import {Monaco} from "@monaco-editor/react";
import {faustLangRegister} from "../monaco-faust/register";
import {editor, MarkerSeverity} from "monaco-editor";

// @ts-ignore
import {initVimMode} from 'monaco-vim';
import {settingsStore} from "./settings.store";
import {faustStore} from "./faust.store";
import {BehaviorSubject} from "rxjs";
import {filesystemStore, FSFile} from "./filesystem.store";

const capitalize = (value: string): string => {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

export type OpenedFile = {
  file: FSFile,
  isTemporary: boolean,
  viewState: editor.ICodeEditorViewState | null,
  value: string
}

class EditorStore {
  private monaco: Monaco | null = null;
  private editor: editor.ICodeEditor | null = null;

  private editorErrorDecoration: string[] = [];

  private vimModeController: any;

  public onOpenedFilesChanged = new BehaviorSubject<OpenedFile[]>([]);
  public onCurrentFileChanged = new BehaviorSubject<OpenedFile | null>(null);

  constructor() {

  }

  private subscribeToSettingsChanges() {
    settingsStore.onSettingsChanged.subscribe(settings => {
      if (settings.editor.isVimMode !== !!this.vimModeController) {
        this.toggleVimMode();
      }
    });
  }

  setMonacoInstance(monaco: Monaco) {
    this.monaco = monaco;
    faustStore.getFaust()
      .then(faust => {
        faustLangRegister(monaco, faust);
      })
  }

  setEditor(editor: editor.ICodeEditor) {
    this.editor = editor;

    console.log('SUBSCRIBING TO EDITOR SETTINGS');

    this.subscribeToSettingsChanges();
  }

  toggleVimMode() {
    if (this.vimModeController) {
      this.vimModeController.dispose();
      this.vimModeController = null;

      this.editor!.updateOptions({
        cursorStyle: "line"
      });
      return;
    }

    this.vimModeController = initVimMode(this.editor, document.querySelector('.vim-bar'));
    this.editor!.updateOptions({
      cursorStyle: "block"
    });

    this.vimModeController.on('vim-mode-change', ({mode}: { mode: string }) => {
      if (mode === 'insert') {
        this.editor!.updateOptions({
          cursorStyle: "line"
        });
      }

      if (mode === 'normal') {
        this.editor!.updateOptions({
          cursorStyle: "block"
        });
      }

    });
  }

  showMephistoErrors(errors: string[]) {
    const editor = this.editor!;

    errors.forEach(e => {

    })
  }

  // TODO: Improve error handling here
  showError(error: string) {
    const editor = this.editor!;

    const [, strline, , errorName, errorData] = error.split(':').map(s => s.trim());

    console.error(error.split(':').map(s => s.trim()))

    const line = parseInt(strline, 10) || Number.MAX_SAFE_INTEGER;
    const lineCount = editor.getModel()!.getLineCount();

    const errorLine = line > lineCount ? 1 : line;

    if (errorName === "undefined symbol") {
      console.log(editor.getModel()!.getLineContent(errorLine));

      const lineContent = editor.getModel()!.getLineContent(errorLine);
      const start = lineContent.indexOf(errorData);

      this.monaco!.editor.setModelMarkers(editor.getModel() as editor.ITextModel, 'faust', [{
        startLineNumber: errorLine,
        startColumn: start + 1,
        endLineNumber: errorLine,
        endColumn: start + errorData.length + 1,
        message: `${capitalize(errorName)}: ${errorData}`,
        severity: MarkerSeverity.Error,
      }]);

      return;
    }

    this.editorErrorDecoration = this.editor!.deltaDecorations(this.editorErrorDecoration, [{
      range: new this.monaco!.Range(errorLine, 1, errorLine, 1),
      options: {
        isWholeLine: true,
        className: "monaco-decoration-line-error",
        linesDecorationsClassName: "monaco-decoration-error"
      }
    }]);

    const lineContent = editor.getModel()!.getLineContent(errorLine);
    this.monaco!.editor.setModelMarkers(this.editor!.getModel() as editor.ITextModel, 'faust', [{
      startLineNumber: errorLine,
      startColumn: 1,
      endLineNumber: errorLine,
      endColumn: lineContent.length + 1,
      message: `Faust: ${capitalize(error)}`,
      severity: MarkerSeverity.Error,
    }]);
  }

  hideError() {
    this.editor!.deltaDecorations(this.editorErrorDecoration, []);
    this.monaco!.editor.setModelMarkers(this.editor!.getModel() as editor.ITextModel, 'faust', []);
  }

  openTemporaryFile(file: FSFile) {
    this.editor!.focus();

    filesystemStore.getFileContent(file)
      .then(content => {
          const openedFiles = [...this.onOpenedFilesChanged.getValue()];
          const currentFile = this.onCurrentFileChanged.getValue();

          if (!currentFile) {
            const newFile: OpenedFile = {
              file,
              isTemporary: true,
              viewState: this.editor!.saveViewState(),
              value: content
            }

            openedFiles.splice(0, 0, newFile);
            this.onCurrentFileChanged.next(newFile);
            this.onOpenedFilesChanged.next(openedFiles);
            return;
          }

          const currentFileIndex = openedFiles.findIndex(of => of.file.key === currentFile.file.key);

          if (currentFile.file.key === file.key) {
            return;
          }

          const openedFile = openedFiles.find(of => of.file.key === file.key);

          if (openedFile) {
            this.onCurrentFileChanged.next(openedFile);
            return;
          }

          if (currentFile.isTemporary) {
            const newFile = {
              ...openedFiles[currentFileIndex],
              file,
              value: content
            }

            openedFiles[currentFileIndex] = newFile;

            this.onCurrentFileChanged.next(newFile);
            this.onOpenedFilesChanged.next(openedFiles);
          } else {
            const newFile: OpenedFile = {
              file,
              isTemporary: true,
              viewState: this.editor!.saveViewState(),
              value: content
            }

            openedFiles.splice(currentFileIndex + 1, 0, newFile);
            this.onCurrentFileChanged.next(newFile);
            this.onOpenedFilesChanged.next(openedFiles);
          }
        }
      )
  }

  openFile(file: FSFile) {
    const currentFile = this.onCurrentFileChanged.getValue();
    const openedFiles = [...this.onOpenedFilesChanged.getValue()];

    if (currentFile && currentFile.file.key === file.key) {
      const currentFileIndex = openedFiles.findIndex(of => of === currentFile);

      if (currentFile.isTemporary) {
        currentFile.isTemporary = false;
        openedFiles[currentFileIndex] = currentFile;
        faustStore.setCode(currentFile.value);
        this.onOpenedFilesChanged.next(openedFiles);
        this.onCurrentFileChanged.next({...currentFile});

        this.editor!.focus();
        return;
      }
    }
  }

  changeCurrentFile(fileKey: string) {
    const openedFiles = [...this.onOpenedFilesChanged.getValue()];
    const currentFile = this.onCurrentFileChanged.getValue();

    if (currentFile?.file.key === fileKey) {
      return;
    }

    const file = openedFiles.find(of => of.file.key === fileKey);

    if (!file) {
      return;
    }

    this.onCurrentFileChanged.next({...file});
    this.editor!.focus();
    faustStore.setCode(file.value);
  }

  closeTab(fileKey: string) {
    const openedFiles = this.onOpenedFilesChanged.getValue();
    const currentFile = this.onCurrentFileChanged.getValue();

    if (!currentFile) {
      return;
    }

    const newOpenedFiles = openedFiles.filter(of => of.file.key !== fileKey);

    if (fileKey === currentFile.file.key) {
      if (newOpenedFiles.length === 0) {
        this.onCurrentFileChanged.next(null);
      } else {
        this.onCurrentFileChanged.next(newOpenedFiles[0]);
      }
    }

    this.onOpenedFilesChanged.next(newOpenedFiles);
  }

  saveEditorViewState(value: string) {
    const openedFiles = [...this.onOpenedFilesChanged.getValue()];
    const currentFile = this.onCurrentFileChanged.getValue();

    if (!currentFile) {
      return;
    }

    if (currentFile.isTemporary) {
      currentFile.isTemporary = false;
    }

    const currentFileIndex = openedFiles.findIndex(of => of.file.key === currentFile.file.key);

    currentFile.value = value;

    openedFiles[currentFileIndex] = {...currentFile};
    this.onCurrentFileChanged.next({...currentFile});
    this.onOpenedFilesChanged.next([...openedFiles]);

    filesystemStore.writeToFile(currentFile.file, value);
  }
}

export const editorStore = new EditorStore();

import {Monaco} from "@monaco-editor/react";
import {faustLangRegister} from "../monaco-faust/register";
import {editor, MarkerSeverity} from "monaco-editor";

// @ts-ignore
import {initVimMode} from 'monaco-vim';
import {settingsStore} from "./settings.store";

const capitalize = (value: string): string => {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

class EditorStore {
  private monaco: Monaco | null = null;
  private editor: editor.ICodeEditor | null = null;

  private editorErrorDecoration: string[] = [];

  private vimModeController: any;

  constructor() {
    settingsStore.onSettingsChanged.subscribe(settings => {
      if (settings.editor.isVimMode !== !!this.vimModeController) {
        this.toggleVimMode();
      }
    })
  }

  setMonacoInstance(monaco: Monaco) {
    this.monaco = monaco;
    faustLangRegister(this.monaco, Faust);
  }

  setEditor(editor: editor.ICodeEditor) {
    this.editor = editor;
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

  // TODO: Improve error handling here
  showError(error: string) {
    const editor = this.editor!;

    const [, strline, , errorName, , errorData] = error.split(':').map(s => s.trim());
    const line = parseInt(strline, 10) || Number.MAX_SAFE_INTEGER;
    const lineCount = editor.getModel()!.getLineCount();

    const errorLine = line > lineCount ? 1 : line;

    console.log('LINE', line, lineCount, errorLine);

    console.log(errorName, errorData);

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
}

export const editorStore = new EditorStore();

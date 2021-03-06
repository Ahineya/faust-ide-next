import React, {useEffect, useState} from "react";
import Editor, {Monaco} from "@monaco-editor/react";
import {editorStore, OpenedFile} from "../stores/editor.store";
import {editor} from "monaco-editor/esm/vs/editor/editor.api";
import "./code-editor.scss";

interface IProps {
  onChange: (value: string) => void;
  value: string | undefined;
}

export const CodeEditor = (props: IProps) => {

  const [currentFile, setCurrentFile] = useState<OpenedFile | null>(null);

  useEffect(() => {
    const subscriptions = [
      editorStore.onCurrentFileChanged.subscribe(currentFile => {
        console.log(currentFile);
        setCurrentFile(currentFile);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  const saveEditorState = (value: string | undefined, event: unknown) => {
    editorStore.hideError();
    editorStore.saveEditorViewState(value || '');
    if (value) {
      props.onChange(value);
    }
  }

  const setMonacoSettings = (monaco: Monaco) => {
    editorStore.setMonacoInstance(monaco);
  }

  const setMonacoEditor = (editor: editor.ICodeEditor) => {
    editorStore.setEditor(editor);
  }

  return <div className="code-editor">
    <Editor
      defaultLanguage="faust"
      onChange={saveEditorState}
      theme="vs-dark"
      defaultPath={''}
      defaultValue={currentFile?.value}
      path={currentFile?.file.key}
      beforeMount={setMonacoSettings}
      onMount={setMonacoEditor}
      options={{automaticLayout: true, mouseWheelZoom: true, fontSize: 13, readOnly: !currentFile}}
    />
  </div>;
}
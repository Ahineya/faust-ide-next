import React from "react";
import Editor, {Monaco} from "@monaco-editor/react";
import {editorStore} from "../stores/editor.store";
import {editor} from "monaco-editor/esm/vs/editor/editor.api";
import "./code-editor.scss";

interface IProps {
  onChange: (value: string) => void;
  value: string | undefined;
}

export const CodeEditor = (props: IProps) => {


  const saveEditorState = (value: string | undefined, event: unknown) => {
    editorStore.hideError();
    // console.log(value, event);
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
      value={props.value}
      beforeMount={setMonacoSettings}
      onMount={setMonacoEditor}
      options={{automaticLayout: true, mouseWheelZoom: true, fontSize: 13}}
    />
  </div>;
}
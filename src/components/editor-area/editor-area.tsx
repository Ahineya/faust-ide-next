import React, {useEffect, useState} from "react";
import "./editor-area.scss";
import {CodeEditor} from "../code-editor";
import {faustStore} from "../../stores/faust.store";
import {useSettings} from "../../hooks/use-settings";

export const EditorArea = () => {

  const [faustCode, setFaustCode] = useState('');

  useEffect(() => {
    const subscriptions = [
      faustStore.onCodeChanged.subscribe(code => {
        setFaustCode(code);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  const editorSettings = useSettings("editor");

  const changeFaustCode = (code: string) => {
    faustStore.setCode(code);
  }

  return <div className="editor-area">
    <CodeEditor onChange={changeFaustCode} value={faustCode}/>
    <div className="vim-bar" style={{display: editorSettings?.isVimMode ? 'block' : 'none'}}/>
  </div>;
}

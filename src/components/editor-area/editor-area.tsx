import React, {useEffect, useMemo, useState} from "react";
import "./editor-area.scss";
import {CodeEditor} from "../code-editor";
import {faustStore} from "../../stores/faust.store";
import {useSettings} from "../../hooks/use-settings";
import {Tabs} from "antd";
import {editorStore, OpenedFile} from "../../stores/editor.store";

import FaustLogo from "../../images/faust-logo-viewbox.svg";
import {FSFile} from "../../stores/filesystem.store";

export const EditorArea = () => {

  const [faustCode, setFaustCode] = useState('');
  const [openedFiles, setOpenedFiles] = useState<OpenedFile[]>([]);
  const [currentFile, setCurrentFile] = useState<OpenedFile | null>(null);

  useEffect(() => {
    const subscriptions = [
      faustStore.onCodeChanged.subscribe(code => {
        setFaustCode(code);
      }),
      editorStore.onOpenedFilesChanged.subscribe(openedFiles => {
        setOpenedFiles(openedFiles);
      }),
      editorStore.onCurrentFileChanged.subscribe(currentFile => {
        setCurrentFile(currentFile);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  const editorSettings = useSettings("editor");

  const changeFaustCode = (code: string) => {
    faustStore.setCode(code);
  }

  const panes: { title: any, key: string }[] = useMemo(() => {
    return openedFiles.map(of => {

      return {
        title: of.isTemporary ? <em className="temporary-file" onDoubleClick={() => {openFile(of.file)}}>{of.file.title}</em> : of.file.title,
        key: of.file.key
      }
    })
  }, [openedFiles, currentFile]);

  const selectFile = (fileKey: string) => {
    editorStore.changeCurrentFile(fileKey);
  }

  const editTabs = (targetKey: any, action: string) => {
    if (action === 'remove') {
      editorStore.closeTab(targetKey);
    }
  }

  const openFile = (file: FSFile) => {
    editorStore.openFile(file);
  }

  return <div className="editor-area">
    <Tabs
      className="editor-tabs"
      type="editable-card"
      onChange={selectFile}
      activeKey={currentFile?.file.key}
      onEdit={editTabs}
      hideAdd
    >
      {panes.map(pane => (
        <Tabs.TabPane tab={pane.title} key={pane.key} closable={true}>
        </Tabs.TabPane>
      ))}
    </Tabs>
    <CodeEditor onChange={changeFaustCode} value={faustCode}/>
    <div className="vim-bar" style={{display: editorSettings?.isVimMode ? 'block' : 'none'}}/>
    {
      !currentFile && <div className="editor-no-open-file-overlay">

        <FaustLogo/>

      </div>
    }

  </div>;
}

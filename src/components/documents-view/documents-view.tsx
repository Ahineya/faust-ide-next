import React, {useEffect, useMemo, useState} from "react";
import "./documents-view.scss";

import {Tree, Menu, Dropdown} from 'antd';

import {
  DownOutlined
} from '@ant-design/icons';

import FaustLogo from "../../images/faust-logo.svg";
import {filesystemStore, FSDirectory, FSFile} from "../../stores/filesystem.store";
import {editorStore} from "../../stores/editor.store";
import {DeleteOutlined, FileAddOutlined, FolderAddOutlined, PlaySquareOutlined} from "@ant-design/icons/lib";
import {faustStore} from "../../stores/faust.store";

const {DirectoryTree} = Tree;

export const DocumentsView = () => {

  const [filesystem, setFilesystem] = useState<FSDirectory | null>(null);

  useEffect(() => {
    const subscriptions = [
      filesystemStore.onFilesystemTreeChanged.subscribe(filesystem => {
        setFilesystem(filesystem);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  const openTemporaryFile = (keys: React.Key[], info: any) => {
    if (info.node.kind === 'file') {
      editorStore.openTemporaryFile(info.node);
    }
  };

  const rightClick = (info: { event: React.MouseEvent<Element, MouseEvent>; node: any }) => {
    console.log(info)
  }

  const treeData = useMemo(() => {
    if (!filesystem) {
      return null;
    }

    replaceTitleWithComponents(filesystem);

    return [filesystem];
  }, [filesystem]);

  const deleteFile = (e: any, file: FSFile) => {
    e.domEvent.stopPropagation();
    filesystemStore.deleteFile(file);
    editorStore.closeTab(file.key);
  }

  const renameFile = (e: any, file: FSFile) => {
    e.domEvent.stopPropagation();
    filesystemStore.renameFile(file)
      .then(newFile => {
        if (!newFile) {
          return;
        }
        editorStore.closeTab(file.key);
        replaceTitleWithComponents(newFile.parent);
        editorStore.openTemporaryFile(newFile);
      })
  }

  const createFile = (e: any, directory: FSDirectory) => {
    e.domEvent.stopPropagation();
    filesystemStore.createFile(directory)
      .then(file => {
        if (file) {
          replaceTitleWithComponents(directory);
          editorStore.openTemporaryFile(file);
        }
      })
  }

  const createDirectory = (e: any, directory: FSDirectory) => {
    e.domEvent.stopPropagation();
    filesystemStore.createDirectory(directory);
  }

  const runFile = (e: any, file: FSFile) => {
    filesystemStore.getFileContent(file)
      .then(code => {
        faustStore.stop();
        setTimeout(() => {
          faustStore.compile(code);
        }, 250);
      });
  }

  function replaceTitleWithComponents(directory: FSDirectory) {
    const directoryMenu = <Menu>
      <Menu.Item key="new-file" icon={<FileAddOutlined/>} onClick={(e) => createFile(e, directory)}>New file</Menu.Item>
      <Menu.Item key="new-folder" icon={<FolderAddOutlined/>} onClick={(e) => createDirectory(e, directory)}>New
        folder</Menu.Item>
      <Menu.Divider/>
      <Menu.Item key="delete-folder" icon={<DeleteOutlined/>} onClick={() => {
      }}>Delete</Menu.Item>
      <Menu.Divider/>
      <Menu.Item onClick={e => e.domEvent.stopPropagation()} key="copy-path">Copy path</Menu.Item>
    </Menu>

    directory.title = <Dropdown overlay={directoryMenu} trigger={['contextMenu']}>
      <div>{directory.name}</div>
    </Dropdown>

    directory.children.forEach(c => {
      if (c.kind === 'directory') {
        replaceTitleWithComponents(c);
      } else {

        // Unfortunately ant design does not give a possibility to create a separate component for this
        const menu = <Menu>
          <Menu.Item key="run" icon={<PlaySquareOutlined/>} onClick={(e) => runFile(e, c)}>Run</Menu.Item>
          <Menu.Divider/>
          <Menu.Item key="rename-file" onClick={(e) => renameFile(e, c)}>Rename</Menu.Item>
          <Menu.Item key="delete-file" icon={<DeleteOutlined/>} onClick={(e) => deleteFile(e, c)}>Delete</Menu.Item>
          <Menu.Divider/>
          <Menu.Item onClick={e => e.domEvent.stopPropagation()} key="copy-path">Copy path</Menu.Item>
        </Menu>

        c.title = <Dropdown overlay={menu} trigger={['contextMenu']}>
          <div className="explorer-node">
            <div className="explorer-node-icon">
              <FaustLogo/>
            </div>
            {c.name}
          </div>
        </Dropdown>
      }
    })
  }

  const openFile = (_: any, file: any) => {
    editorStore.openFile(file as FSFile);
  }

  return <div className="documents-view">
    {
      treeData && <DirectoryTree
        multiple
        draggable
        defaultExpandAll
        onSelect={openTemporaryFile}
        onDoubleClick={openFile}
        treeData={treeData}
        showIcon={false}
        showLine={{showLeafIcon: false}}
        switcherIcon={<DownOutlined/>}
        onRightClick={rightClick}
      />
    }
  </div>;
}
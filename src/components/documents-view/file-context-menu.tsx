import React from "react";
import {filesystemStore, FSFile} from "../../stores/filesystem.store";
import {Menu} from "antd";

interface IProps {
  file: FSFile
}

import {
  DeleteOutlined
} from '@ant-design/icons';

export const FileContextMenu = (props: IProps) => {

  const deleteFile = () => {
    filesystemStore.deleteFile(props.file);
  }

  return <Menu>
    <Menu.Item key="1">Rename</Menu.Item>
    <Menu.Item key="2" icon={<DeleteOutlined/>} onClick={deleteFile}>Delete</Menu.Item>
    <Menu.Divider/>
    <Menu.Item onClick={e => e.domEvent.stopPropagation()} key="3">Copy path</Menu.Item>
  </Menu>
}
import React, {useEffect, useMemo, useState} from "react";
import "./documents-view.scss";

import {Tree, Menu, Dropdown} from 'antd';

import {
  DownOutlined,
  DeleteOutlined
} from '@ant-design/icons';

import FaustLogo from "../../images/faust-logo.svg";
import {filesystemStore, FSDirectory, FSFile} from "../../stores/filesystem.store";
import {editorStore} from "../../stores/editor.store";

const {DirectoryTree} = Tree;

const menu = (
  <Menu>
    <Menu.Item key="1">Rename</Menu.Item>
    <Menu.Item key="2" icon={<DeleteOutlined/>}>Delete</Menu.Item>
    <Menu.Divider/>
    <Menu.Item onClick={e => e.domEvent.stopPropagation()} key="3">Copy path</Menu.Item>
  </Menu>
);

// const treeData = [
//   {
//     title: 'modules',
//     key: '0-0',
//     expanded: false,
//     children: [
//       {
//         title: <Dropdown overlay={menu} trigger={['contextMenu']}><div className="explorer-node">
//           <div className="explorer-node-icon">
//             <FaustLogo/>
//           </div>
//           filter.dsp
//         </div></Dropdown>, key: '0-0-0', isLeaf: true, allowDrop: false
//       },
//       {
//         title:<div className="explorer-node">
//           <div className="explorer-node-icon">
//             <FaustLogo/>
//           </div>
//           oscillator-that-has-disgustingly-long-name-and-does-not-fit-the-line.dsp
//         </div>,
//         key: '0-0-1',
//         isLeaf: true, allowDrop: false
//       },
//     ],
//   },
//   {
//     title: 'helpers',
//     key: '0-1',
//     children: [
//       {title: 'to-cv.dsp', key: '0-1-0', isLeaf: true, allowDrop: false},
//       {title: 'midi-note-to-cv.dsp', key: '0-1-1', isLeaf: true, allowDrop: false},
//       {
//         title: 'more-helpers',
//         key: '0-1-2',
//         children: [
//           {title: 'to-cv.dsp', key: '0-1-2-0', isLeaf: true, allowDrop: false},
//           {title: 'midi-note-to-cv.dsp', key: '0-1-2-1', isLeaf: true, allowDrop: false},
//         ],
//       },
//     ],
//   },
//   {title: 'main.dsp', key: '1-0', isLeaf: true, allowDrop: false}
// ];

export const DocumentsView = () => {

  const [filesystem, setFilesystem] = useState<FSDirectory | null>(null);

  useEffect(() => {
    const subscriptions = [
      filesystemStore.onFilesystemTreeChanged.subscribe(filesystem => {
        console.log(filesystem);
        setFilesystem(filesystem);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  const onSelect = (keys: React.Key[], info: any) => {
    if (info.node.kind === 'file') {
      editorStore.openTemporaryFile(info.node);
    }
  };

  const onExpand = () => {
    console.log('Trigger Expand');
  };

  const rightClick = (info: { event: React.MouseEvent<Element, MouseEvent>; node: any }) => {
    console.log(info)
  }

  const treeData = useMemo(() => {
    if (!filesystem) {
      return null;
    }

    // TODO: Traverse filesystem, create components for nodes

    return [filesystem];
  }, [filesystem]);

  const dblclick = (_: any, file: any) => {
    editorStore.openFile(file as FSFile);
  }

  return <div className="documents-view">
    {
      treeData && <DirectoryTree
        multiple
        draggable
        defaultExpandAll
        onSelect={onSelect}
        onExpand={onExpand}
        onDoubleClick={dblclick}
        treeData={treeData}
        showIcon={false}
        showLine={{showLeafIcon: false}}
        switcherIcon={<DownOutlined/>}
        onRightClick={rightClick}
      />
    }
  </div>;
}
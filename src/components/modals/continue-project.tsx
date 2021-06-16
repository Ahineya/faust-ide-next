import React, {useEffect, useState} from "react";
import {Modal} from "antd";
import {filesystemStore} from "../../stores/filesystem.store";

export const ContinueProjectModal = () => {

  const [dir, setDir] = useState<FileSystemDirectoryHandle | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const subscriptions = [
      filesystemStore.onProjectDirectoryChanged.subscribe(dir => {
        setDir(dir);
      }),
      filesystemStore.onSavedProjectDirectoryAccess.subscribe(isPermissionsGranted => {
        setHasPermission(isPermissionsGranted);
        console.log(isPermissionsGranted);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  const continueProject = () => {
    filesystemStore.continueProject();
  }

  const startProject = () => {
    filesystemStore.openDirectory();
  }

  return <div>
    <Modal
          visible={!hasPermission}
          title="Title">
      {
        !!dir && <button onClick={continueProject}>Continue working on {dir.name}</button>
      }
      <button onClick={startProject}>Start new project</button>
    </Modal>

  </div>;
}

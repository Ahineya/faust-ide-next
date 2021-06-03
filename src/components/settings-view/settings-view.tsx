import React from "react";
import "./settings-view.scss";
import {Checkbox} from "../ui-controls/checkbox/checkbox";
import {useSettings} from "../../hooks/use-settings";
import {settingsStore} from "../../stores/settings.store";

export const SettingsView = () => {

  const editorSettings = useSettings("editor");

  return <div className="settings-view">
    <h1>Settings</h1>
    <h2>Editor</h2>

    <div className="settings">
      <div className="setting">
        <div className="setting-header">
          Editor: <strong>Enable Vim mode</strong>
        </div>
        <div className="setting-control">
          <Checkbox checked={editorSettings?.isVimMode} label="Vim mode" onChange={() => {
            settingsStore.setEditorVimMode(!editorSettings?.isVimMode);
          }}/>
        </div>
      </div>

      <div className="setting">
        <div className="setting-header">
          Editor: Enable Vim mode
        </div>
        <div className="setting-control">
          [ ] Vim mode
        </div>
      </div>

      <div className="setting">
        <div className="setting-header">
          Editor: Enable Vim mode
        </div>
        <div className="setting-control">
          [ ] Vim mode
        </div>
      </div>
    </div>
  </div>;
}
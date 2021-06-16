import React from "react";
import "./sidebar-view.scss";
import {useLeftSidebarView} from "../../hooks/use-left-sidebar-view";
import {SettingsView} from "../settings-view/settings-view";
import {DocumentsView} from "../documents-view/documents-view";

export const SidebarView = () => {

  const view = useLeftSidebarView();

  return <div className="sidebar-view">
    {
      view === "settings" && <SettingsView/>
    }

    {
      view === "documents" && <DocumentsView/>
    }
  </div>;
}
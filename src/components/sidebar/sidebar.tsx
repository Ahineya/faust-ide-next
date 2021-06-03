import React, {useEffect, useState} from "react";
import "./sidebar.scss";
import IconFiles from "../../images/icons/icon-files.svg";
import IconSettings from "../../images/icons/icon-settings.svg";
import {layoutStore, TSidebarView} from "../../stores/layout-store";
import classNames from "classnames";
import {useLeftSidebarView} from "../../hooks/use-left-sidebar-view";

export const Sidebar = () => {

  const view = useLeftSidebarView();

  const toggleDocuments = () => {
    if (view === 'documents') {
      layoutStore.hideSidebar();
    } else {
      layoutStore.showDocuments();
    }
  }

  const toggleSettings = () => {
    if (view === 'settings') {
      layoutStore.hideSidebar();
    } else {
      layoutStore.showSettings();
    }
  }

  return <div className="sidebar">
    <div className={classNames("sidebar-button", {active: view === "documents"})} onClick={toggleDocuments}>
      <IconFiles/>
    </div>
    <div className={classNames("sidebar-button", {active: view === "settings"})} onClick={toggleSettings}>
      <IconSettings/>
    </div>
  </div>;
}

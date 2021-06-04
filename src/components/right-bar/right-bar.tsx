import React, {useEffect, useState} from "react";
import "./right-bar.scss";
import {layoutStore, TRightSidebarView} from "../../stores/layout-store";
import classNames from "classnames";
import {useRightBarViews} from "../../hooks/use-right-bar-views";

export const RightBar = () => {

  const views = useRightBarViews();

  const toggleDiagram = () => {
    layoutStore.toggleDiagram();
  }

  const togglePlot = () => {
    layoutStore.togglePlot();
  }

  return <div className="right-bar">
    <div className={classNames("button", {active: views.includes("diagram")})} onClick={toggleDiagram}>
      <div className="button-text">
        Diagram
      </div>
    </div>
     <div className={classNames("button", {active: views.includes("plot")})} onClick={togglePlot}>
      <div className="button-text">
        Plot
      </div>
    </div>
  </div>;
}

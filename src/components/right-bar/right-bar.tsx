import React, {useEffect, useState} from "react";
import "./right-bar.scss";
import {layoutStore, TRightSidebarView} from "../../stores/layout-store";
import classNames from "classnames";

export const RightBar = () => {

  const [views, setViews] = useState<TRightSidebarView[]>([]);

  useEffect(() => {
    const subscriptions = [
      layoutStore.onRightBarViewsChanged.subscribe(views => {
        setViews(views);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  const toggleDiagram = () => {
    layoutStore.toggleDiagram();
  }

  return <div className="right-bar">
    <div className={classNames("button", {active: views.includes("diagram")})} onClick={toggleDiagram}>
      <div className="button-text">
        Diagram
      </div>
    </div>
  </div>;
}

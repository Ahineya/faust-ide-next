import React, {useEffect, useState} from "react";
import "./right-bar-view.scss";
import {DiagramPanel} from "../diagram-panel/diagram-panel";
import SplitPane from "react-split-pane";
import {layoutStore, TRightSidebarView} from "../../stores/layout-store";


export const RightBarView = () => {

  const [views, setViews] = useState<TRightSidebarView[]>([]);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const subscriptions = [
      layoutStore.onRightBarViewsChanged.subscribe(views => {
        setViews(views);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  const changeSize = (size: number) => {
    setSize(size);
  }

  return views.length
    ? <div className="right-bar-view">
      <SplitPane split="horizontal" minSize={200} pane1Style={{overflow: 'hidden', width: '100%'}}
                 allowResize={views.length > 1} onChange={changeSize} size={size} primary="second">
        <DiagramPanel/>
        <div/>
      </SplitPane>
    </div>
    : <div/>
}

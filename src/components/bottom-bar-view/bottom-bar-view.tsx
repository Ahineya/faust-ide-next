import React, {useEffect, useState} from "react";
import "./bottom-bar-view.scss";
import {DiagramPanel} from "../diagram-panel/diagram-panel";
import {layoutStore, TRightSidebarView} from "../../stores/layout-store";
import {Plot} from "../plot/plot";
import {ReflexContainer, ReflexElement, ReflexSplitter} from "react-reflex";
import {DspUi} from "../dsp-ui/dsp-ui";

export const BottomBarView = () => {

  const [views, setViews] = useState<TRightSidebarView[]>([]);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const subscriptions = [
      layoutStore.onRightBarViewsChanged.subscribe(views => {
        setViews(views);
        if (views.length > 1) {
          setSize(200);
        }
        {
          if (views.length <= 1) {
            setSize(0);
          }
        }
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  const changeSize = (size: number) => {
    setSize(size);
  }

  const getViews = () => {

    const elements: JSX.Element[] = [];

    views.forEach(v => {
      if (v === "diagram") {
        elements.push(<ReflexElement minSize={200} key="diagram" propagateDimensions>
          <DiagramPanel/>
        </ReflexElement>)
        elements.push(<ReflexSplitter key="diagram-splitter"/>);
        return;
      }

      if (v === "plot") {
        elements.push(<ReflexElement minSize={200} key="plot" propagateDimensions>
          <Plot key="plot-element"/>
        </ReflexElement>)
        elements.push(<ReflexSplitter key="plot-splitter"/>);
        return;
      }

      if (v === "ui") {
        elements.push(<ReflexElement minSize={200} key="ui" propagateDimensions>
          <DspUi key="ui-element"/>
        </ReflexElement>)
        elements.push(<ReflexSplitter key="ui-splitter"/>);
        return;
      }
    });

    elements.pop();

    return elements;
  }

  return views.length
    ? <div className="bottom-bar-view">
      <ReflexContainer orientation="vertical">
        {getViews()}
      </ReflexContainer>
    </div>
    : <div/>
}

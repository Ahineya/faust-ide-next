import React, {useEffect, useState} from "react";
import "./main-area.scss";
import {Sidebar} from "../sidebar/sidebar";
import {RightBar} from "../right-bar/right-bar";
import {EditorArea} from "../editor-area/editor-area";
import {layoutStore, TRightSidebarView, TSidebarView} from "../../stores/layout-store";
import {SidebarView} from "../sidebar-view/sidebar-view";
import {RightBarView} from "../right-bar-view/right-bar-view";
import {ReflexContainer, ReflexElement, ReflexSplitter} from "react-reflex";
import 'react-reflex/styles.css';

export const MainArea = () => {

  const [leftSidebarView, setLeftSidebarView] = useState<TSidebarView | null>(null);
  const [rightSidebarViews, setRightSidebarViews] = useState<TRightSidebarView[]>([]);
  const [leftSidebarSize, setLeftSidebarSize] = useState(0);
  const [rightSidebarSize, setRightSidebarSize] = useState(0);

  useEffect(() => {
    const subscriptions = [
      layoutStore.onSidebarViewChanged.subscribe(view => {
        setLeftSidebarView(view);
        setLeftSidebarSize(view ? 350 : 0);
      }),
      layoutStore.onRightBarViewsChanged.subscribe(views => {
        setRightSidebarViews(views);
        setRightSidebarSize(views.length ? 500 : 0);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  const setPanelSize = ({domElement}: { domElement: Element | Text }) => {
    if (!domElement) {
      return;
    }
    setLeftSidebarSize((domElement as HTMLDivElement).offsetWidth);
  }

  const changeRightSidebarSize = ({domElement}: { domElement: Element | Text }) => {
    if (!domElement) {
      return;
    }

    setRightSidebarSize((domElement as HTMLDivElement).offsetWidth);
  }

  return <div className="main-area">
    <Sidebar/>
    {/*<div className="div" style={{flexGrow: 1, height: '100%', position: 'relative'}}>*/}


      <ReflexContainer orientation="vertical">

        {
          leftSidebarView && <ReflexElement className="left-pane" minSize={200} size={leftSidebarSize} onResize={setPanelSize}>
            <SidebarView/>
          </ReflexElement>
        }
        {
          leftSidebarView && <ReflexSplitter/>
        }

        <ReflexElement className="right-pane" key="editor">
          <EditorArea/>
        </ReflexElement>

        {
          !!rightSidebarViews.length && <ReflexSplitter/>
        }

        {
          !!rightSidebarViews.length && <ReflexElement minSize={200} size={rightSidebarSize} onResize={changeRightSidebarSize}>
            <RightBarView/>
          </ReflexElement>
        }
      </ReflexContainer>

      {/*<div style={{height: 0}}>*/}
      {/*  <SplitPane split="vertical" minSize={200} size={leftSidebarSize} onChange={setPanelSize}*/}
      {/*             allowResize={!!leftSidebarView}>*/}
      {/*    <SplitPane split="vertical" minSize={200} defaultSize={500} primary="second" pane1Style={{overflow: "hidden"}}*/}
      {/*               size={rightSidebarSize} onChange={changeRightSidebarSize} allowResize={!!rightSidebarViews.length}>*/}

      {/*    </SplitPane>*/}
      {/*  </SplitPane>*/}
      {/*</div>*/}
    {/*</div>*/}
    <RightBar/>
  </div>;
}

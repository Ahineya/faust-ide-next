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
import {BottomBarView} from "../bottom-bar-view/bottom-bar-view";

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

  console.log('LEFT SIDEBAR VIEW', leftSidebarView);

  return <div className="main-area">
    <Sidebar/>
    <div className="main-area-container">
      <ReflexContainer orientation="horizontal">

        <ReflexElement className="main-area-top" minSize={200}>
          <ReflexContainer orientation="vertical">

            <ReflexElement className="left-pane" key="left-sidebar" minSize={leftSidebarView ? 200 : 0}
                           maxSize={leftSidebarView ? 1000 : 0} size={leftSidebarView ? leftSidebarSize : 1}
                           onResize={setPanelSize}>
              <SidebarView/>
            </ReflexElement>
            <ReflexSplitter style={{display: leftSidebarView ? 'block' : 'none'}}/>

            <ReflexElement className="right-pane" key="editor" minSize={300}>
              <EditorArea/>
            </ReflexElement>

            {/*{*/}
            {/*  !!rightSidebarViews.length && <ReflexSplitter/>*/}
            {/*}*/}

            {/*{*/}
            {/*  !!rightSidebarViews.length &&*/}
            {/*  <ReflexElement minSize={200} size={rightSidebarSize} onResize={changeRightSidebarSize}>*/}
            {/*    <RightBarView/>*/}
            {/*  </ReflexElement>*/}
            {/*}*/}
          </ReflexContainer>
        </ReflexElement>

        <ReflexSplitter/>

        <ReflexElement className="main-area-bottom" minSize={200} maxSize={300}>
          <div className="bottom-bar">Bottom bar</div>
          <BottomBarView/>
        </ReflexElement>

      </ReflexContainer>

    </div>

    <RightBar/>
  </div>;
}

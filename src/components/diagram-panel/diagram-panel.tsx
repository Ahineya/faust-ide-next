import React, {useEffect, useState} from "react";
import "./diagram-panel.scss";
import {faustStore} from "../../stores/faust.store";
import createPanZoom, {PanZoom} from "panzoom";

(window as any).preventDiagramClick = false;

(window as any).diagramsvg = (name: string) => {
  if (!(window as any).preventDiagramClick) {
    faustStore.loadDiagram(name);
  }
}

export const DiagramPanel = () => {
const [diagram, setDiagram] = useState<string | null>('');
  const [div, setDiv] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const subscriptions = [
      faustStore.onDiagramChanged.subscribe(diagram => {
        setDiagram(diagram);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  useEffect(() => {
    if (!div || !diagram) {
      return;
    }

    const instance = createPanZoom(div);

    instance.on('panstart', (e: PanZoom) => {
      (window as any).preventDiagramClick = true;
    });

    instance.on('panend', (e: PanZoom) => {
      setTimeout(() => {
        (window as any).preventDiagramClick = false;
      }, 0);
    });

    return () => {
      instance.dispose();
    }
  }, [div, diagram]);

  return <div className="diagram-panel">
    {/*{*/}
    {/*  diagram*/}
    {/*    ? <div ref={setDiv}>*/}
    {/*  <div dangerouslySetInnerHTML={{__html: diagram || ''}}/>*/}
    {/*</div>*/}
    {/*    : <div>No diagram</div>*/}
    {/*}*/}

    <div id="plot-ui">

    </div>
  </div>;
}
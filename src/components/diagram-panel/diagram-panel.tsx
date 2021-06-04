import React, {useEffect, useMemo, useState} from "react";
import "./diagram-panel.scss";
import {faustStore} from "../../stores/faust.store";
import createPanZoom, {PanZoom} from "panzoom";

// @ts-ignore
import * as svgloader from "react-svgmt";

console.log(svgloader);
const {SvgLoader, SvgProxy} = svgloader;

(window as any).preventDiagramClick = false;

(window as any).diagramsvg = (name: string) => {
  if (!(window as any).preventDiagramClick) {
    faustStore.loadDiagram(name);
  }
}

export const DiagramPanel = () => {
  const [diagram, setDiagram] = useState<string | null>('');
  const [div, setDiv] = useState<HTMLDivElement | null>(null);

  const [preventDiagramClick, setPreventDiagramClick] = useState(false);

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
      setPreventDiagramClick(true);
    });

    instance.on('panend', (e: PanZoom) => {
      setTimeout(() => {
        (window as any).preventDiagramClick = false;
        setPreventDiagramClick(false);
      }, 0);
    });

    return () => {
      instance.dispose();
    }
  }, [div, diagram]);

  const diagramClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (preventDiagramClick) {
      e.nativeEvent.preventDefault();
      return;
    }

    for (let target = e.nativeEvent.target as Element; target && target !== this; target = target.parentNode as Element) {
      if (target.matches('a')) {
        const diagramURI = (target as SVGAElement).href.baseVal;
        faustStore.loadDiagram(diagramURI);
        e.nativeEvent.preventDefault();
        break;
      }

      if (target.matches('svg')) {
        break;
      }
    }
  }

  const replacedDiagram = useMemo(() => {
    return diagram
      ?.replaceAll('#cccccc', 'none')
      .replaceAll('#ffffff', '#2b2b2b')
      .replaceAll('#FFFFFF', '#AFB1B3')
      .replaceAll('black', '#AFB1B3')
      .replaceAll('#003366', '#284869')
      .replaceAll('#f44800', '#753c07')
      .replaceAll('#477881', '#3a694e')
      .replaceAll('#47945E', '#265c58')
      .replaceAll('#4B71A1', '#2c4461')
  }, [diagram]);

  return <div className="diagram-panel">
    {
      diagram
        ? <div ref={setDiv}>
          <SvgLoader svgXML={replacedDiagram} onClick={diagramClick} fill="#AFB1B3"/>
        </div>
        : <div>No diagram</div>
    }

  </div>;
}
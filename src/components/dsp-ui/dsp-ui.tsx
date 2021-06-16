import React, {useEffect, useState} from "react";
import "./dsp-ui.scss";
import {TFaustUI} from "./types";
import {uiStore} from "../../stores/ui.store";
import {UiNode} from "./ui-node";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch/dist";

export const DspUi = () => {

  const [ui, setUi] = useState<TFaustUI | null>(null);
  const [position, setPosition] = useState<{positionX: number, positionY: number, scale: number}>({positionX: 0, positionY: 0, scale: 1});

  useEffect(() => {
    const subscriptions = [
      uiStore.onUIChanged.subscribe(ui => {
        setUi(ui);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  const changePanning = (p: {positionX: number, positionY: number, scale: number}) => {
    console.log(p);
    setPosition(p);
  }

  useEffect(() => {
    setPosition({positionX: 0, positionY: 0, scale: 1});
  }, [ui]);

  return <div className="dsp-ui">
    <div className="dsp-ui-header"/>
    <TransformWrapper
      options={{minScale: 0.2, limitToBounds: false, centerContent: false}}
      doubleClick={{disabled: true}}
      wheel={{step: 1}}
      onPanning={changePanning}
      {...position}
    >
      <TransformComponent>
        {
          ui
            ? <UiNode node={ui[0]}/>
            : <div/>
        }
      </TransformComponent>
    </TransformWrapper>


  </div>;
}

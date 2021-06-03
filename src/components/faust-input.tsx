import React, {useEffect, useState} from "react";
import {faustStore} from "../stores/faust.store";
import {CodeEditor} from "./code-editor";

(window as any).diagramsvg = (name: string) => {
  faustStore.loadDiagram(name);
}

export const FaustInput = () => {
  const [faustCode, setFaustCode] = useState(`import("stdfaust.lib");
process = ba.pulsen(1, 10000) : pm.djembe(60, 0.3, 0.4, 1) <: dm.freeverb_demo;`);

  const [diagram, setDiagram] = useState<string | null>('');

  useEffect(() => {
    const subscriptions = [
      faustStore.onDiagramChanged.subscribe(diagram => {
        setDiagram(diagram);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  const changeFaustCode = (value: string) => {
    setFaustCode(value);
  }

  const execute = () => {
    faustStore.compile(faustCode);
  }

  const stop = () => {
    faustStore.stop();
  }

  return <div className="faust-input">
    <CodeEditor onChange={changeFaustCode} value={faustCode}/>

    {/*<button onClick={execute}>Run</button>*/}
    {/*<button onClick={stop}>Stop</button>*/}

    {/*<div dangerouslySetInnerHTML={{__html: diagram ||''}}></div>*/}
  </div>;
}
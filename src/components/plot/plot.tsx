import React, {useEffect, useState} from "react";
import "./plot.scss";
import {plotStore} from "../../stores/plot.store";

export const Plot = () => {
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerElement) {
      plotStore.setPlotElementVisible(containerElement);
    }

    return () => {
      plotStore.setPlotElementHidden();
    }
  }, [containerElement]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      plotStore.drawCurrent();
    });

    if (containerElement) {
      resizeObserver.observe(containerElement);
    }

    return () => {
      resizeObserver.disconnect();
    }
  }, [containerElement]);

  const showSpectroscope = () => {
    plotStore.showSpectroscope();
  }

  const showData = () => {
    plotStore.showData();
  }

  return <div className="plot">
    <div className="plot-header">
      <button onClick={showSpectroscope}>Spectroscope</button>
      <button onClick={showData}>Data</button>
    </div>
    <div className="plot-ui" ref={setContainerElement}>
    </div>
  </div>;
}

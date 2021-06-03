import React, {useEffect, useState} from "react";
import "./top-panel.scss";

import IconRun from "../../images/icons/icon-run.svg";
import IconStop from "../../images/icons/icon-stop.svg";
import {faustStore} from "../../stores/faust.store";
import classNames from "classnames";

export const TopPanel = () => {

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const subscriptions = [
      faustStore.onRunningChanged.subscribe(isRunning => {
        setIsRunning(isRunning);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  const run = () => {
    if (!isRunning) {
      faustStore.run();
    }
  }

  const stop = () => {
    if (isRunning) {
      faustStore.stop();
    }
  }

  return <div className="top-panel">
    <div className={classNames("button", {disabled: isRunning})} onClick={run}>
      <IconRun/>
    </div>
    <div className={classNames("button", {disabled: !isRunning})} onClick={stop}>
      <IconStop/>
    </div>
  </div>;
}

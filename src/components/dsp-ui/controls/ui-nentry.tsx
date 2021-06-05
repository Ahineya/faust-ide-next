import React, {useEffect, useState} from "react";
import {TFaustUIInputItem} from "../types";
import {uiStore} from "../../../stores/ui.store";
import {map} from "rxjs/operators";
import {faustStore} from "../../../stores/faust.store";
import "./ui-nentry.scss";

interface IProps {
  node: TFaustUIInputItem;
}

export const UiNentry = (props: IProps) => {

  const control = props.node;

  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    const subscriptions = [
      uiStore.onParamsChanged
        .pipe(map(e => e[props.node.address]))
        .subscribe(newValue => {
          if (newValue === undefined) {
            return;
          }
          setValue(newValue);
        })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, [props.node]);

  const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, min, max } = e.target;
    const newValue = Math.max(Number(min), Math.min(Number(max), Number(value)));
    faustStore.setParamValue(control.address, newValue);
  }

  return <div className="ui-nentry">
    <input
      type="number"
      min={control.min || void 0}
      max={control.max || void 0}
      step={control.step || void 0}
      onChange={changeValue}
      value={value}
      onMouseDown={e => e.stopPropagation()}
    />
    <div className="ui-nentry-label">{control.label}</div>
  </div>;
}

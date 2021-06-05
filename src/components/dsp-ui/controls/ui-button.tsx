import React from "react";
import {TFaustUIInputItem} from "../types";
import {faustStore} from "../../../stores/faust.store";

interface IProps {
  node: TFaustUIInputItem;
}

export const UiButton = (props: IProps) => {


  const changeButtonPressed = () => {
    faustStore.setParamValue(props.node.address, 1);

  }

  const changeButtonReleased = () => {
    faustStore.setParamValue(props.node.address, 0);
  }

  return <button
    onMouseDown={changeButtonPressed}
    onMouseUp={changeButtonReleased}
  >{props.node.label}</button>;
}

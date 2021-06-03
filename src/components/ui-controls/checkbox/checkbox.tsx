import classNames from "classnames";
import React from "react";
import "./checkbox.scss";
import Checkmark from "./checkmark.svg";

interface IProps {
  checked: boolean;
  label: string;
  onChange: () => void;
}

export const Checkbox = (props: IProps) => {
  return <div className={classNames("checkbox", {checked: props.checked})} onClick={() => props.onChange()}>
    <div className="checkbox-box">
      {props.checked && <Checkmark/>}
    </div>
    <div className="checkbox-label">
      {props.label}
    </div>
  </div>;
}

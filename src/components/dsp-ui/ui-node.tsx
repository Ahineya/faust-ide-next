import React from "react";
import {TFaustUIInputItem, TFaustUIItem} from "./types";
import classNames from "classnames";
import "./ui-node.scss";
import {UiButton} from "./controls/ui-button";
import {UiNentry} from "./controls/ui-nentry";

interface IProps {
  node: TFaustUIItem;
}

export const UiNode = (props: IProps) => {


  if (/* TFaustUIGroup */ 'items' in props.node) {

    if (props.node.type === "tgroup") {
      return <div className="ui-group tgroup">TAB GROUP</div>;
    }

    return <div className={classNames("ui-group", props.node.type)}>
      <div className="ui-group-label">{props.node.label}</div>
      <div className="ui-group-items">
        {
          props.node.items?.length && props.node.items.map(item => {
            return <UiNode node={item} key={item.label}/>
          })
        }
      </div>

    </div>

  }

  if (/*  */'type' in props.node) {
    if (props.node.type === "button") {
      return <UiButton node={props.node as TFaustUIInputItem}/>
    }
    // if (props.node.type === "vslider") {
      return <UiNentry node={props.node as TFaustUIInputItem}/>//<div style={{width: "fit-content", height: 100, order: props.node.index, backgroundColor: '#fafafa'}}>{props.node.label}</div>
    // }
  }

  return <div>
  </div>;
}
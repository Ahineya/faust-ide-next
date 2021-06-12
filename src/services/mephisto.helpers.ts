import {BaseNode} from "../../parser/build/ast/nodes.interface";

export const isNode = (node: BaseNode, nodeClass: { type: string, [key: string]: any } | { type: string, [key: string]: any }[]): boolean => {
  if (!node) {
    return false;
  }

  if (Array.isArray(nodeClass)) {
    return nodeClass.some(nc => isNode(node, nc));
  }

  return node.constructor.name === nodeClass.type;
}


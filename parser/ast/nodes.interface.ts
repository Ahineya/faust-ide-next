export interface IPosition {
  start: {
    line: number;
    column: number;
  },
  end: {
    line: number;
    column: number;
  }
}

export type ExpressionNode = CompositionExpressionNode | ExpressionStubNode | WithExpressionNode | LetrecExpressionNode | PrimitiveExpressionWrapperNode;
export type InfixExpressionNode = BinaryExpressionNode | ExpressionStubNode | DelayExpressionNode | ApplicationExpressionNode |  PrimitiveNode | PrimitiveExpressionWrapperNode;

export type Node = ExpressionNode
  | InfixExpressionNode
  | PrimitiveNode
  | null;

export class BaseNode implements IPosition {

}

export interface BaseNode extends IPosition {
  type: string;
}

export interface ProgramNode extends BaseNode {
  type: 'ProgramNode';
  body: {
    definitions: DefinitionNode[];
    imports: ImportNode[];
    declares: DeclareNode[];
  },
}

export interface IdentifierNode extends BaseNode {
  type: 'IdentifierNode',
  name: string;
}

export interface DefinitionNode extends BaseNode {
  type: 'DefinitionNode';
  id: IdentifierNode; // identifier here
  args: Node | null;
  recursive?: boolean;
  //precision: 'quadprecision' // TODO: Do not forget about variant definitions
  expr: Node;
}

export interface ImportNode extends BaseNode {
  type: 'ImportNode';
  import: string;
}

export interface DeclareNode extends BaseNode {
  type: 'DeclareNode';
  fnName?: string;
  name: string;
  value: string;
}

export interface ExpressionStubNode extends BaseNode {
  type: 'ExpressionStubNode';
  text?: string;
}

export interface VariantStatementNode extends BaseNode {
  type: 'VariantStatementNode';
  precision: string;
  body: ImportNode | DeclareNode | DefinitionNode; // TODO: this one is incorrect
}

export interface CompositionExpressionNode extends BaseNode {
  type: 'CompositionExpressionNode';
  operator: '~' | ',' | ':' | ':>' | '<:' | '+>';
  left: Node;
  right: Node;
}

export interface WithExpressionNode extends BaseNode {
  type: 'WithExpressionNode';
  expr: Node;
  context: DefinitionNode[];
}

export interface LetrecExpressionNode extends BaseNode {
  type: 'LetrecExpressionNode';
  expr: Node;
  context: DefinitionNode[];
}

export interface BinaryExpressionNode extends BaseNode {
  type: 'BinaryExpressionNode';
  left: Node;
  right: Node;
  operator: string;
}

export interface DelayExpressionNode extends BaseNode {
  type: 'DelayExpressionNode';
  delay: number;
  expr: Node;
}

export interface ApplicationExpressionNode extends BaseNode {
  type: 'ApplicationExpressionNode',
  args: Node,
  // TODO: Change callee type
  callee: Node;
}

export type PrimitiveNode =
  PrimitiveStubNode
  | PrimitiveNumberNode
  | PrimitiveWireNode
  | PrimitiveCutNode
  | PrimitiveTypeNode
  | PrimitiveIdentifierNode
  | PrimitiveExpressionWrapperNode
  | ControlNode

;

export interface PrimitiveNumberNode extends BaseNode {
  type: 'PrimitiveNumberNode';
  value: number;
}

export interface PrimitiveStubNode extends BaseNode {
  type: 'PrimitiveStubNode';
}

export interface PrimitiveWireNode extends BaseNode {
  type: 'PrimitiveWireNode';
}

export interface PrimitiveCutNode extends BaseNode {
  type: 'PrimitiveCutNode';
}

export interface PrimitiveTypeNode extends BaseNode {
  type: 'PrimitiveTypeNode';
  primitive: string;
}

export interface PrimitiveExpressionWrapperNode extends BaseNode {
  type: 'PrimitiveExpressionWrapperNode',
  expr: PrimitiveNode | ExpressionNode | InfixExpressionNode,
}

type PrimitiveIdentifierNode = PrimitivePositiveIdentifierNode | PrimitiveNegativeIdentifierNode;

export interface PrimitivePositiveIdentifierNode extends BaseNode {
  type: 'PrimitivePositiveIdentifierNode';
  id: IdentifierNode
}

export interface PrimitiveNegativeIdentifierNode extends BaseNode {
  type: 'PrimitiveNegativeIdentifierNode';
  id: IdentifierNode,
}

type ControlNode = InputControlNode | OutputControlNode | ControlErrorNode;
type InputControlNode = ButtonNode;
type OutputControlNode = null;

export interface ButtonNode extends BaseNode {
  type: 'ButtonNode',
  label: string;
}

export interface ControlErrorNode {
  type: 'ControlErrorNode'
  error: string;
}
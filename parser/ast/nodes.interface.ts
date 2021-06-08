export interface IPosition {
  line: number;
  column: number;
}

export interface ILocation {
  start: IPosition;
  end: IPosition
}

export abstract class BaseNode {
  public readonly abstract  type: string;

  constructor(public location: ILocation) {
  }
}

export class Program extends BaseNode {
  public readonly type = 'Program';

  constructor(public body: (Definition | Import | Declare)[], location: ILocation) {
    super(location);
  }
}

export class Environment extends BaseNode {
  public readonly type = 'Environment';

  constructor(public body: (Definition | Import | Declare)[], location: ILocation) {
    super(location);
  }
}

export class Identifier extends BaseNode {
  public readonly type = 'Identifier';

  constructor(
    public name: string,
    location: ILocation
  ) {
    super(location);
  }
}

export class Definition extends BaseNode {
  public readonly type = 'Definition';

  constructor(
    public id: BaseNode | null,
    public args: (BaseNode | null)[] | null,
    public recursive: boolean,
    public expression: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class PrecisionDeclaration extends BaseNode {
  public readonly type = 'PrecisionDeclaration';

  constructor(
    public precision: string,
    public declaration: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class FileImport extends BaseNode {
  public type = 'FileImport';

  constructor(
    public source: string,
    location: ILocation
  ) {
    super(location);
  }
}

export class Import extends FileImport {
  public readonly type = 'Import';
}

export class Component extends FileImport {
  public readonly type = 'Component';
}

export class Library extends FileImport {
  public readonly type = 'Library';
}

export class Declare extends BaseNode {
  public readonly type = 'Declare';

  constructor(
    public fnName: string | null,
    public name: string,
    public value: string,
    location: ILocation
  ) {
    super(location);
  }
}

export class CompositionExpression extends BaseNode {
  public readonly type = 'CompositionExpression';

  constructor(
    public operator: '~' | ',' | ':' | ':>' | '<:' | '+>',
    public left: BaseNode | null,
    public right: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class WithExpression extends BaseNode {
  public readonly type = 'WithExpression';

  constructor(
    public expression: BaseNode | null,
    public context: Definition[],
    location: ILocation
  ) {
    super(location);
  }
}

export class LetrecExpression extends BaseNode {
  public readonly type = 'LetrecExpression';

  constructor(
    public expression: BaseNode | null,
    public context: Definition[],
    location: ILocation
  ) {
    super(location);
  }
}

export class BinaryExpression extends BaseNode {
  public readonly type = 'BinaryExpression';

  constructor(
    public operator: string,
    public left: BaseNode | null,
    public right: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class ApplicationExpression extends BaseNode {
  public readonly type = 'ApplicationExpression';

  constructor(
    public args: (BaseNode | null)[] | null,
    public callee: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export abstract class Primitive extends BaseNode {}

export class NumberPrimitive extends Primitive {
  public readonly type = 'NumberPrimitive';

  constructor(
    public value: number,
    public location: ILocation
  ) {
    super(location);
  }
}

export class WirePrimitive extends Primitive {
  public readonly type = 'WirePrimitive';
}

export class CutPrimitive extends Primitive {
  public readonly type = 'CutPrimitive';
}

export class BroadPrimitive extends Primitive {
  public readonly type = 'BroadPrimitive';

  constructor(
    public primitive: string,
    location: ILocation,
  ) {
    super(location);
  }
}

export class UnaryExpression extends BaseNode {
  public readonly type = 'UnaryExpression';

  constructor(
    public operator: '-',
    public argument: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class PostfixDelayExpression extends BaseNode {
  public readonly type = 'PostfixDelayExpression';

  constructor(
    public expression: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export abstract class Control extends Primitive {
  constructor(
    public label: string,
    location: ILocation
  ) {
    super(location);

    // TODO: Parse label metadata here
  }
}
export abstract class InputControl extends Control {}
export abstract class OutputControl extends Control {}

export class ButtonControl extends InputControl {
  public readonly type = 'ButtonControl';
}

export class CheckboxControl extends InputControl {
  public readonly type = 'CheckboxControl';
}

export class NumericInputControl extends InputControl {
  public readonly type = 'NumericInputControl';
  public readonly controlType: string = 'Unknown';

  constructor(
    public label: string,
    public initialValue: BaseNode | null,
    public min: BaseNode | null,
    public max: BaseNode | null,
    public step: BaseNode | null,

    location: ILocation
  ) {
    super(label, location);
  }
}

export class GroupControl extends Control {
  public readonly type = 'GroupControl';
  public readonly groupType: string = 'unknown';

  constructor(
    public label: string,
    public content: BaseNode | null,
    location: ILocation
  ) {
    super(label, location);
  }
}

export class VGroupControl extends GroupControl {
  public readonly groupType = 'vgroup';
}

export class HGroupControl extends GroupControl {
  public readonly groupType = 'hgroup';
}

export class TGroupControl extends GroupControl {
  public readonly groupType = 'tgroup';
}

export class VsliderControl extends NumericInputControl {
  public readonly controlType = 'vslider';
}

export class HsliderControl extends NumericInputControl {
  public readonly controlType = 'hslider';
}

export class NentryControl extends NumericInputControl {
  public readonly controlType = 'nentry';
}

export class BargraphControl extends OutputControl {
  public readonly type = 'BargraphControl';
  public readonly controlType: string = 'unknown';

  constructor(
    public label: string,
    public min: BaseNode | null,
    public max: BaseNode | null,
    location: ILocation
  ) {
    super(label, location);
  }
}

export class VbargraphControl extends BargraphControl {
  public readonly controlType = 'vbargraph';
}

export class HbargraphControl extends BargraphControl {
  public readonly controlType = 'vbargraph';
}

export class Soundfile extends BaseNode {
  public readonly type = 'Soundfile';

  constructor(
    public label: string,
    public outs: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class IterativeExpression extends BaseNode {
  public readonly type = 'IterativeExpression';
  public readonly operator: string = 'unknown';

  constructor(
    public counter: BaseNode | null,
    public iterations: BaseNode | null,
    public expression: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class ParIteration extends IterativeExpression {
  public readonly operator = 'par';
}

export class SumIteration extends IterativeExpression {
  public readonly operator = 'sum';
}

export class SeqIteration extends IterativeExpression {
  public readonly operator = 'seq';
}

export class ProdIteration extends IterativeExpression {
  public readonly operator = 'prod';
}

export class AccessExpression extends BaseNode {
  public readonly type = 'AccessExpression';

  constructor(
    public environment: BaseNode | null,
    public property: BaseNode | null,
    location: ILocation,
  ) {
    super(location);
  }
}

export class InputsCall extends BaseNode {
  public readonly type = 'InputsCall';

  constructor(
    public expression: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class OutputsCall extends BaseNode {
  public readonly type = 'OutputsCall';

  constructor(
    public expression: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class Waveform extends BaseNode {
  public readonly type = 'Waveform';

  constructor(
    public values: (number | null)[] | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class Route extends BaseNode {
  public readonly type = "Route";

  constructor(
    public ins: BaseNode | null,
    public outs: BaseNode | null,
    public pairs: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class StubNode extends BaseNode {
  public readonly type = 'STUB_NODE';

  constructor(
    public text: string,
    location: ILocation
  ) {
    super(location);
  }
}


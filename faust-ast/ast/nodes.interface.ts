export interface IPosition {
  line: number;
  column: number;
}

export interface ILocation {
  start: IPosition;
  end: IPosition;
  range: [number, number];
}

export class BaseNode {
  public static readonly type: string = 'BaseNode';

  public scope: number | null = null;
  public scopeStack: number[] = [];

  public insN: number | null = null;
  public outsN: number | null = null;

  constructor(public location: ILocation) {
  }

  process(enter: (node: BaseNode) => void, exit?: (node: BaseNode) => void) {
    enter(this);

    Object.keys(this)
      .forEach(key => {
        // @ts-ignore
        if (this[key] instanceof BaseNode) {
          // @ts-ignore
          this[key].process(enter);
        }
        // @ts-ignore
        if (Array.isArray(this[key])) {
          //@ts-ignore
          this[key].forEach(n => {
            if (n instanceof BaseNode) {
              n.process(enter)
            }
          });
        }
      });

    if (exit) {
      exit(this);
    }
  }
}

export class Program extends BaseNode {
  public static readonly type = 'Program';
  public comments: (CommentLine | CommentBlock)[] = [];

  constructor(public body: (Definition | Import | Declare)[], location: ILocation) {
    super(location);
  }
}

export class Environment extends BaseNode {
  public static readonly type = 'Environment';

  constructor(public body: (Definition | Import | Declare)[], location: ILocation) {
    super(location);
  }
}

export class Identifier extends BaseNode {
  public static readonly type = 'Identifier';

  constructor(
    public name: string,
    location: ILocation
  ) {
    super(location);
  }
}

export class IdentifierDeclaration extends BaseNode {
  public static readonly type = 'IdentifierDeclaration';

  constructor(
    public name: string,
    location: ILocation
  ) {
    super(location);
  }
}

export class Definition extends BaseNode {
  public static readonly type = 'Definition';

  constructor(
    public id: IdentifierDeclaration | null,
    public args: (BaseNode | null)[] | null,
    public recursive: boolean,
    public expression: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class PatternDefinition extends BaseNode {
  public static readonly type = 'PatternDefinition';

  constructor(
    public id: IdentifierDeclaration | null,
    public args: (BaseNode | null)[] | null,
    public recursive: boolean,
    public expression: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class PrecisionDeclaration extends BaseNode {
  public static readonly type = 'PrecisionDeclaration';

  constructor(
    public precision: (string | null)[],
    public declaration: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class FileImport extends BaseNode {
  public static type = 'FileImport';

  constructor(
    public source: string,
    location: ILocation
  ) {
    super(location);
  }
}

export class ExplicitSubstitution extends BaseNode {
  public static readonly type = "ExplicitSubstitution";

  constructor(
    public substitutions: (BaseNode | null)[] | null,
    public expression: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class PatternMatching extends BaseNode {
  public static readonly type = "PatternMatching";

  constructor(
    public patterns: (BaseNode | null)[] | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class Pattern extends BaseNode {
  public static readonly type = "Pattern";

  constructor(
    public args: (BaseNode | null)[] | null,
    public expression: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class Import extends FileImport {
  public static readonly type = 'Import';
}

export class Component extends FileImport {
  public static readonly type = 'Component';
}

export class Library extends FileImport {
  public static readonly type = 'Library';
}

export class Declare extends BaseNode {
  public static readonly type = 'Declare';

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
  public static readonly type = 'CompositionExpression';

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
  public static readonly type = 'WithExpression';

  constructor(
    public expression: BaseNode | null,
    public context: Definition[],
    location: ILocation
  ) {
    super(location);
  }
}

export class LetrecExpression extends BaseNode {
  public static readonly type = 'LetrecExpression';

  constructor(
    public expression: BaseNode | null,
    public context: Definition[],
    location: ILocation
  ) {
    super(location);
  }
}

export class BinaryExpression extends BaseNode {
  public static readonly type = 'BinaryExpression';

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
  public static readonly type = 'ApplicationExpression';

  constructor(
    public args: (BaseNode | null)[] | null,
    public callee: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export abstract class Primitive extends BaseNode {
}

export class NumberPrimitive extends Primitive {
  public static readonly type = 'NumberPrimitive';

  constructor(
    public value: number,
    public location: ILocation
  ) {
    super(location);
  }
}

export class WirePrimitive extends Primitive {
  public static readonly type = 'WirePrimitive';
}

export class CutPrimitive extends Primitive {
  public static readonly type = 'CutPrimitive';
}

export class BroadPrimitive extends Primitive {
  public static readonly type = 'BroadPrimitive';

  constructor(
    public primitive: string,
    location: ILocation,
  ) {
    super(location);
  }
}

export class UnaryExpression extends BaseNode {
  public static readonly type = 'UnaryExpression';

  constructor(
    public operator: '-',
    public argument: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class PostfixDelayExpression extends BaseNode {
  public static readonly type = 'PostfixDelayExpression';

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

export abstract class InputControl extends Control {
}

export abstract class OutputControl extends Control {
}

export class ButtonControl extends InputControl {
  public static readonly type = 'ButtonControl';
}

export class CheckboxControl extends InputControl {
  public static readonly type = 'CheckboxControl';
}

export class NumericInputControl extends InputControl {
  public static type = 'NumericInputControl';
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
  public static type = 'GroupControl';
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
  public static readonly type = 'VGroupControl';
  public readonly groupType = 'vgroup';
}

export class HGroupControl extends GroupControl {
  public static readonly type = 'HGroupControl';
  public readonly groupType = 'hgroup';
}

export class TGroupControl extends GroupControl {
  public static readonly type = 'TGroupControl';
  public readonly groupType = 'tgroup';
}

export class VsliderControl extends NumericInputControl {
  public static readonly type = 'VsliderControl';
  public readonly controlType = 'vslider';
}

export class HsliderControl extends NumericInputControl {
  public static readonly type = 'HsliderControl';
  public readonly controlType = 'hslider';
}

export class NentryControl extends NumericInputControl {
  public static readonly type = 'NentryControl';
  public readonly controlType = 'nentry';
}

export class BargraphControl extends OutputControl {
  public static type = 'BargraphControl';
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
  public static type = 'HBargraphControl';
  public readonly controlType = 'vbargraph';
}

export class HbargraphControl extends BargraphControl {
  public static type = 'HBargraphControl';
  public readonly controlType = 'vbargraph';
}

export class Soundfile extends BaseNode {
  public static readonly type = 'Soundfile';

  constructor(
    public label: string,
    public outs: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class IterativeExpression extends BaseNode {
  public static type = 'IterativeExpression';
  public readonly operator: string = 'unknown';

  constructor(
    public counter: Identifier | null,
    public iterations: BaseNode | null,
    public expression: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class ParIteration extends IterativeExpression {
  public static type = 'ParIteration';
  public readonly operator = 'par';
}

export class SumIteration extends IterativeExpression {
  public static type = 'SumIteration';
  public readonly operator = 'sum';
}

export class SeqIteration extends IterativeExpression {
  public static type = 'SeqIteration';
  public readonly operator = 'seq';
}

export class ProdIteration extends IterativeExpression {
  public static type = 'ProdIteration';
  public readonly operator = 'prod';
}

export class AccessExpression extends BaseNode {
  public static readonly type = 'AccessExpression';

  constructor(
    public environment: BaseNode | null,
    public property: BaseNode | null,
    location: ILocation,
  ) {
    super(location);
  }
}

export class InputsCall extends BaseNode {
  public static readonly type = 'InputsCall';

  constructor(
    public expression: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class OutputsCall extends BaseNode {
  public static readonly type = 'OutputsCall';

  constructor(
    public expression: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class Waveform extends BaseNode {
  public static readonly type = 'Waveform';

  constructor(
    public values: (number | null)[] | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class Route extends BaseNode {
  public static readonly type = "Route";

  constructor(
    public ins: BaseNode | null,
    public outs: BaseNode | null,
    public pairs: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class ForeignFunction extends BaseNode {
  public static readonly type = "ForeignFunction";

  constructor(
    public fnType: string | null,
    public signature: string | null,
    public types: (string | null)[] | null,
    public headerFile: string | null,
    public str: string | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class ForeignConstant extends BaseNode {
  public static readonly type = "ForeignConstant";

  constructor(
    public ctype: string | null,
    public name: string | null,
    public str: string | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class ForeignVariable extends BaseNode {
  public static readonly type = "ForeignVariable";

  constructor(
    public ctype: string | null,
    public name: string | null,
    public str: string | null,
    location: ILocation
  ) {
    super(location);
  }
}

export class LambdaExpression extends BaseNode {
  public static readonly type = "LambdaExpression";

  constructor(
    public params: (Identifier | null)[] | null,
    public expression: BaseNode | null,
    location: ILocation
  ) {
    super(location);
  }
}

// Comments are not actually nodes, but they share the same interface

export class CommentLine extends BaseNode {
  public static readonly type = "CommentLine";

  constructor(
    public text: string,
    location: ILocation
  ) {
    super(location);
  }
}

export class CommentBlock extends BaseNode {
  public static readonly type = "CommentBlock";

  constructor(
    public text: string,
    location: ILocation
  ) {
    super(location);
  }
}
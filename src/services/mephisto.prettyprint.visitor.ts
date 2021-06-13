import {
  Definition,
  Program,
  Declare,
  Import,
  Identifier,
  BaseNode,
  CompositionExpression,
  WithExpression,
  LetrecExpression,
  BinaryExpression,
  ApplicationExpression,
  NumberPrimitive,
  WirePrimitive,
  CutPrimitive,
  BroadPrimitive,
  UnaryExpression,
  ButtonControl,
  PrecisionDeclaration,
  CheckboxControl,
  VsliderControl,
  HsliderControl,
  NentryControl,
  VGroupControl,
  HGroupControl,
  TGroupControl,
  VbargraphControl,
  HbargraphControl,
  Soundfile,
  ParIteration,
  SumIteration,
  SeqIteration,
  ProdIteration,
  AccessExpression,
  OutputsCall,
  InputsCall,
  PostfixDelayExpression,
  Component,
  Library,
  Environment,
  Waveform,
  Route,
  ForeignFunction,
  ForeignConstant,
  ForeignVariable,
  LambdaExpression,
  ExplicitSubstitution,
  PatternMatching,
  Pattern,
  IdentifierDeclaration,
  PatternDefinition,
  IterativeExpression
} from "../../parser/build/ast/nodes.interface";
import {isNode} from "./mephisto.helpers";
import {MephistoBaseVisitor} from "./mephisto.visitor";

export class MephistoPrettyPrintVisitor extends MephistoBaseVisitor {

  private indent = 0;

  constructor(public debug = false) {
    super(debug);
  }


  public visitDefinition(node: Definition, parent?: BaseNode): string {
    return `${node.recursive ? "'" : ''}${this.visitIdentifierDeclaration(node.id)} = ${this.visit(node.expression)};`;
  }

  public visitProgram(node: Program, parent?: BaseNode) {

    const imports = node.body.filter((node: BaseNode) => isNode(node, Import)).map((node: BaseNode) => this.visit(node)).map((r: string) => r).join("\n");
    const other = node.body.filter((node: BaseNode) => !isNode(node, Import)).map((node: BaseNode) => this.visit(node)).map((r: string) => r).join("\n");

    return `${imports}\n\n${other}`;
  }

  public visitDeclare(node: Declare, parent?: BaseNode) {
    if (node.fnName) {
      return `declare ${node.fnName} ${node.name} ${node.value};`;
    }

    return `declare ${node.name} ${node.value};`;
  }

  public visitImport(node: Import, parent?: BaseNode) {
    return `import("${node.source}");`;
  }

  public visitIdentifier(node: Identifier, parent?: BaseNode) {
    return node.name;
  }

  public visitBaseNode(node: BaseNode, parent?: BaseNode) {
    return 'ERROR';
  }

  public visitCompositionExpression(node: CompositionExpression, parent?: BaseNode): string {

    const compositionOperatorsPrecedence = ['~', ',', ':', '<:', ':>', '+>'];

    let left = this.visit(node.left);
    let right = this.visit(node.right);

    if (isNode(node.left, CompositionExpression)) {
      const currentOperatorPrecedence = compositionOperatorsPrecedence.findIndex(op => op === node.operator);
      const leftOperatorPrecedence = compositionOperatorsPrecedence.findIndex(op => op === node.left.operator);

      if (currentOperatorPrecedence > leftOperatorPrecedence) {
        left = `(${left})`;
      }
    }

    if (isNode(node.right, CompositionExpression)) {
      const currentOperatorPrecedence = compositionOperatorsPrecedence.findIndex(op => op === node.operator);
      const rightOperatorPrecedence = compositionOperatorsPrecedence.findIndex(op => op === node.right.operator);

      if (currentOperatorPrecedence > rightOperatorPrecedence) {
        right = `(${right})`;
      }
    }

    if (node.operator === ',') {
      return `${left}${node.operator} ${right}`;
    }

    return `${left} ${node.operator} ${right}`;
  }

  public visitWithExpression(node: WithExpression, parent?: BaseNode): string {
    const indent = Array.from(new Array(this.indent), () => '  ');
    this.indent++;
    const definitions = node.context.map((node: BaseNode) => this.visit(node));

    const withString = `(${this.visit(node.expression)})
${indent}with {
${indent}  ${definitions.join(`\n${indent}  `)}
${indent}}`;

    this.indent--;

    return withString;
  }

  public visitLetrecExpression(node: LetrecExpression, parent?: BaseNode) {
    const indent = Array.from(new Array(this.indent), () => '  ');
    this.indent++;
    const definitions = node.context.map((node: BaseNode) => this.visit(node));

    const letrecString = `(${this.visit(node.expression)})
${indent}letrec {
${indent}  ${definitions.join(`\n${indent}  `)}
${indent}}`;

    this.indent--;

    return letrecString;
  }

  public visitBinaryExpression(node: BinaryExpression, parent?: BaseNode): string {

    // Count operators precedence here

    const binaryOperatorsPrecedence = ['^', '<<', '>>', '*', '/', '%', '+', '-', '&', '|', 'xor', '<', '<=', '>', '>=', '==', '!=', '@'].reverse();

    let left = this.visit(node.left);
    let right = this.visit(node.right);

    if (isNode(node.left, BinaryExpression)) {
      const currentOperatorPrecedence = binaryOperatorsPrecedence.findIndex(op => op === node.operator);
      const leftOperatorPrecedence = binaryOperatorsPrecedence.findIndex(op => op === node.left.operator);

      if (currentOperatorPrecedence > leftOperatorPrecedence) {
        left = `(${left})`;
      }
    }

    if (isNode(node.right, BinaryExpression)) {
      const currentOperatorPrecedence = binaryOperatorsPrecedence.findIndex(op => op === node.operator);
      const rightOperatorPrecedence = binaryOperatorsPrecedence.findIndex(op => op === node.right.operator);

      if (currentOperatorPrecedence > rightOperatorPrecedence) {
        right = `(${right})`;
      }
    }

    if (isNode(node.left, CompositionExpression)) {
      left = `(${left})`;
    }

    if (isNode(node.right, CompositionExpression)) {
      right = `(${right})`;
    }

    return `${left} ${node.operator} ${right}`;
  }

  public visitApplicationExpression(node: ApplicationExpression, parent?: BaseNode): string {
    const args = node.args.map((arg: BaseNode) => this.visit(arg));
    return `${this.visit(node.callee)}(${args.join(', ')})`;
  }

  public visitNumberPrimitive(node: NumberPrimitive, parent?: BaseNode) {
    return node.value;
  }

  public visitWirePrimitive(node: WirePrimitive, parent?: BaseNode) {
    return "_";
  }

  public visitCutPrimitive(node: CutPrimitive, parent?: BaseNode) {
    return "!";
  }

  public visitBroadPrimitive(node: BroadPrimitive, parent?: BaseNode) {
    return node.primitive;
  }

  public visitUnaryExpression(node: UnaryExpression, parent?: BaseNode): string {
    return `${node.operator}${this.visit(node.argument)}`;
  }

  public visitButtonControl(node: ButtonControl, parent?: BaseNode) {
    return `button("${node.label}")`;
  }

  public visitPrecisionDeclaration(node: PrecisionDeclaration, parent?: BaseNode) {
    if (!node.precision.length) {
      return `${this.visit(node.declaration)}`
    }

    return `${node.precision.join(' ')} ${this.visit(node.declaration)}`;
  }

  public visitCheckboxControl(node: CheckboxControl, parent?: BaseNode) {
    return `checkbox("${node.label}")`;
  }

  public visitVsliderControl(node: VsliderControl, parent?: BaseNode) {
    return `vslider("${node.label}", ${this.visit(node.initialValue)}, ${this.visit(node.min)}, ${this.visit(node.max)}, ${this.visit(node.step)})`;
  }

  public visitHsliderControl(node: HsliderControl, parent?: BaseNode) {
    return `hslider("${node.label}", ${this.visit(node.initialValue)}, ${this.visit(node.min)}, ${this.visit(node.max)}, ${this.visit(node.step)})`;
  }

  public visitNentryControl(node: NentryControl, parent?: BaseNode) {
    return `nentry("${node.label}", ${this.visit(node.initialValue)}, ${this.visit(node.min)}, ${this.visit(node.max)}, ${this.visit(node.step)})`;
  }

  public visitVGroupControl(node: VGroupControl, parent?: BaseNode): string {
    return `vgroup("${node.label}", ${this.visit(node.content)})`;
  }

  public visitHGroupControl(node: HGroupControl, parent?: BaseNode): string {
    return `hgroup("${node.label}", ${this.visit(node.content)})`;
  }

  public visitTGroupControl(node: TGroupControl, parent?: BaseNode): string {
    return `tgroup("${node.label}", ${this.visit(node.content)})`;
  }

  public visitVbargraphControl(node: VbargraphControl, parent?: BaseNode) {
    return `vbargraph("${node.label}", ${this.visit(node.min)}, ${this.visit(node.max)})`;
  }

  public visitHbargraphControl(node: HbargraphControl, parent?: BaseNode) {
    return `hbargraph("${node.label}", ${this.visit(node.min)}, ${this.visit(node.max)})`;
  }

  public visitSoundfile(node: Soundfile, parent?: BaseNode) {
    return `soundfile(${node.label}, ${this.visit(node.outs)})`;
  }

  public visitParIteration(node: ParIteration, parent?: BaseNode) {
    return `${node.expression}(${this.visit(node.counter)}, ${this.visit(node.iterations)}, ${this.visit(node.expression)})`;
  }

  public visitSumIteration(node: SumIteration, parent?: BaseNode) {
    return `${node.expression}(${this.visit(node.counter)}, ${this.visit(node.iterations)}, ${this.visit(node.expression)})`;
  }

  public visitSeqIteration(node: SeqIteration, parent?: BaseNode) {
    return `${node.expression}(${this.visit(node.counter)}, ${this.visit(node.iterations)}, ${this.visit(node.expression)})`;
  }

  public visitProdIteration(node: ProdIteration, parent?: BaseNode) {
    return `${node.expression}(${this.visit(node.counter)}, ${this.visit(node.iterations)}, ${this.visit(node.expression)})`;
  }

  public visitAccessExpression(node: AccessExpression, parent?: BaseNode): string {
    return `${this.visit(node.environment)}.${this.visit(node.property)}`;
  }

  public visitOutputsCall(node: OutputsCall, parent?: BaseNode) {
    return `outputs(${this.visit(node.expression)})`;
  }

  public visitInputsCall(node: InputsCall, parent?: BaseNode) {
    return `inputs(${this.visit(node.expression)})`;
  }

  public visitPostfixDelayExpression(node: PostfixDelayExpression, parent?: BaseNode) {
    return `${this.visit(node.expression)}'`;
  }

  public visitComponent(node: Component, parent?: BaseNode) {
    return `component("${node.source}")`;
  }

  public visitLibrary(node: Library, parent?: BaseNode) {
    return `library("${node.source}")`;
  }

  public visitEnvironment(node: Environment, parent?: BaseNode) {
    const indent = Array.from(new Array(this.indent), () => '  ');
    this.indent++;
    const definitions = node.body.map((node: BaseNode) => this.visit(node));

    const environmentString = `environment {
${indent}  ${definitions.join(`\n${indent}  `)}
${indent}}`;

    this.indent--;

    return environmentString;
  }

  public visitWaveform(node: Waveform, parent?: BaseNode) {
    const args = node.values;

    return `waveform(${args.join(', ')})`;
  }

  public visitRoute(node: Route, parent?: BaseNode) {
    return `route(${this.visit(node.ins)}, ${this.visit(node.outs)}, ${this.visit(node.pairs)})`;
  }

  public visitForeignFunction(node: ForeignFunction, parent?: BaseNode) {
    return `ffunction(${node.fnType} ${node.signature} (${node.types}), ${node.headerFile}, ${node.str})`;
  }

  public visitForeignConstant(node: ForeignConstant, parent?: BaseNode) {
    return `fconst(${node.ctype} ${node.name}, ${node.str})`;
  }

  public visitForeignVariable(node: ForeignVariable, parent?: BaseNode) {
    return `fvariable(${node.ctype} ${node.name}, ${node.str})`;
  }

  public visitLambdaExpression(node: LambdaExpression, parent?: BaseNode) {
    const args = node.params.map((p: BaseNode) => this.visit(p));

    return `\\(${args.join(', ')}).(${this.visit(node.expression)})`;
  }

  public visitExplicitSubstitution(node: ExplicitSubstitution, parent?: BaseNode) {
    const indent = Array.from(new Array(this.indent), () => '  ');
    this.indent++;
    const definitions = node.substitutions.map((node: BaseNode) => this.visit(node));

    const substitutionString = `${this.visit(node.expression)} [
${indent}  ${definitions.join(`\n${indent}  `)}
${indent}]`;

    this.indent--;

    return substitutionString;
  }

  public visitPatternMatching(node: PatternMatching, parent?: BaseNode) {
    const indent = Array.from(new Array(this.indent), () => '  ');
    this.indent++;
    const definitions = node.patterns.map((node: BaseNode) => this.visit(node));

    const environmentString = `case {
${indent}  ${definitions.join(`\n${indent}  `)}
${indent}}`;

    this.indent--;

    return environmentString;
  }

  public visitPattern(node: Pattern, parent?: BaseNode) {
    const args = node.args.map((a: BaseNode) => this.visit(a));
    return `(${args.join(', ')}) => ${this.visit(node.expression)};`;
  }

  public visitIdentifierDeclaration(node: IdentifierDeclaration, parent?: BaseNode) {
    return node.name;
  }

  public visitPatternDefinition(node: PatternDefinition, parent?: BaseNode) {
    const args = node.args.map((arg: BaseNode) => this.visit(arg));
    return `${this.visitIdentifierDeclaration(node.id)}(${args.join(', ')}) = ${this.visit(node.expression)};`;
  }

  public visitIterativeExpression(node: IterativeExpression, parent?: BaseNode) {
    return `${node.expression}(${this.visit(node.counter)}, ${this.visit(node.iterations)}, ${this.visit(node.expression)})`;
  }


  public visit(node: BaseNode, parent?: BaseNode): string {
    if (isNode(node, Definition)) {
      return this.visitDefinition(node as Definition, parent);
    }

    if (isNode(node, Program)) {
      return this.visitProgram(node as Program, parent);
    }

    if (isNode(node, Declare)) {
      return this.visitDeclare(node as Declare, parent);
    }

    if (isNode(node, Import)) {
      return this.visitImport(node as Import, parent);
    }

    if (isNode(node, Identifier)) {
      return this.visitIdentifier(node as Identifier, parent);
    }

    if (isNode(node, BaseNode)) {
      return this.visitBaseNode(node as BaseNode, parent);
    }

    if (isNode(node, CompositionExpression)) {
      return this.visitCompositionExpression(node as CompositionExpression, parent);
    }

    if (isNode(node, WithExpression)) {
      return this.visitWithExpression(node as WithExpression, parent);
    }

    if (isNode(node, LetrecExpression)) {
      return this.visitLetrecExpression(node as LetrecExpression, parent);
    }

    if (isNode(node, BinaryExpression)) {
      return this.visitBinaryExpression(node as BinaryExpression, parent);
    }

    if (isNode(node, ApplicationExpression)) {
      return this.visitApplicationExpression(node as ApplicationExpression, parent);
    }

    if (isNode(node, NumberPrimitive)) {
      return this.visitNumberPrimitive(node as NumberPrimitive, parent);
    }

    if (isNode(node, WirePrimitive)) {
      return this.visitWirePrimitive(node as WirePrimitive, parent);
    }

    if (isNode(node, CutPrimitive)) {
      return this.visitCutPrimitive(node as CutPrimitive, parent);
    }

    if (isNode(node, BroadPrimitive)) {
      return this.visitBroadPrimitive(node as BroadPrimitive, parent);
    }

    if (isNode(node, UnaryExpression)) {
      return this.visitUnaryExpression(node as UnaryExpression, parent);
    }

    if (isNode(node, ButtonControl)) {
      return this.visitButtonControl(node as ButtonControl, parent);
    }

    if (isNode(node, PrecisionDeclaration)) {
      return this.visitPrecisionDeclaration(node as PrecisionDeclaration, parent);
    }

    if (isNode(node, CheckboxControl)) {
      return this.visitCheckboxControl(node as CheckboxControl, parent);
    }

    if (isNode(node, VsliderControl)) {
      return this.visitVsliderControl(node as VsliderControl, parent);
    }

    if (isNode(node, HsliderControl)) {
      return this.visitHsliderControl(node as HsliderControl, parent);
    }

    if (isNode(node, NentryControl)) {
      return this.visitNentryControl(node as NentryControl, parent);
    }

    if (isNode(node, VGroupControl)) {
      return this.visitVGroupControl(node as VGroupControl, parent);
    }

    if (isNode(node, HGroupControl)) {
      return this.visitHGroupControl(node as HGroupControl, parent);
    }

    if (isNode(node, TGroupControl)) {
      return this.visitTGroupControl(node as TGroupControl, parent);
    }

    if (isNode(node, VbargraphControl)) {
      return this.visitVbargraphControl(node as VbargraphControl, parent);
    }

    if (isNode(node, HbargraphControl)) {
      return this.visitHbargraphControl(node as HbargraphControl, parent);
    }

    if (isNode(node, Soundfile)) {
      return this.visitSoundfile(node as Soundfile, parent);
    }

    if (isNode(node, ParIteration)) {
      return this.visitParIteration(node as ParIteration, parent);
    }

    if (isNode(node, SumIteration)) {
      return this.visitSumIteration(node as SumIteration, parent);
    }

    if (isNode(node, SeqIteration)) {
      return this.visitSeqIteration(node as SeqIteration, parent);
    }

    if (isNode(node, ProdIteration)) {
      return this.visitProdIteration(node as ProdIteration, parent);
    }

    if (isNode(node, AccessExpression)) {
      return this.visitAccessExpression(node as AccessExpression, parent);
    }

    if (isNode(node, OutputsCall)) {
      return this.visitOutputsCall(node as OutputsCall, parent);
    }

    if (isNode(node, InputsCall)) {
      return this.visitInputsCall(node as InputsCall, parent);
    }

    if (isNode(node, PostfixDelayExpression)) {
      return this.visitPostfixDelayExpression(node as PostfixDelayExpression, parent);
    }

    if (isNode(node, Component)) {
      return this.visitComponent(node as Component, parent);
    }

    if (isNode(node, Library)) {
      return this.visitLibrary(node as Library, parent);
    }

    if (isNode(node, Environment)) {
      return this.visitEnvironment(node as Environment, parent);
    }

    if (isNode(node, Waveform)) {
      return this.visitWaveform(node as Waveform, parent);
    }

    if (isNode(node, Route)) {
      return this.visitRoute(node as Route, parent);
    }

    if (isNode(node, ForeignFunction)) {
      return this.visitForeignFunction(node as ForeignFunction, parent);
    }

    if (isNode(node, ForeignConstant)) {
      return this.visitForeignConstant(node as ForeignConstant, parent);
    }

    if (isNode(node, ForeignVariable)) {
      return this.visitForeignVariable(node as ForeignVariable, parent);
    }

    if (isNode(node, LambdaExpression)) {
      return this.visitLambdaExpression(node as LambdaExpression, parent);
    }

    if (isNode(node, ExplicitSubstitution)) {
      return this.visitExplicitSubstitution(node as ExplicitSubstitution, parent);
    }

    if (isNode(node, PatternMatching)) {
      return this.visitPatternMatching(node as PatternMatching, parent);
    }

    if (isNode(node, Pattern)) {
      return this.visitPattern(node as Pattern, parent);
    }

    if (isNode(node, IdentifierDeclaration)) {
      return this.visitIdentifierDeclaration(node as IdentifierDeclaration, parent);
    }

    if (isNode(node, PatternDefinition)) {
      return this.visitPatternDefinition(node as PatternDefinition, parent);
    }

    if (isNode(node, IterativeExpression)) {
      return this.visitIterativeExpression(node as IterativeExpression, parent);
    }

    return `[ERROR PRETTYPRINTING ${node.constructor.name}. Please, undo the change and contact me deadswallow@gmail.com]`;
  }

  public visitChildren(node: BaseNode, parent?: BaseNode) {

    if (!node) {
      return;
    }

    Object.keys(node)
      .forEach(key => {
        // @ts-ignore
        if (node[key] instanceof BaseNode) {
          // @ts-ignore
          this.visit(node[key], parent);
        }
        // @ts-ignore
        if (Array.isArray(node[key])) {
          //@ts-ignore
          node[key].forEach(n => {
            if (n instanceof BaseNode) {
              // @ts-ignore
              this.visit(n, parent);
            }
          });
        }
      });
  }
}

export const mephistoPrettyPrintVisitor = new MephistoPrettyPrintVisitor();

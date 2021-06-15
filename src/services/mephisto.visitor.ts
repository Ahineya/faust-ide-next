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
} from "../../faust-ast/build/ast/nodes.interface";
import {isNode} from "./mephisto.helpers";

class MephistoError {
  constructor(
    public message: string,
    public type: string
  ) {
  }

  toString() {
    return this.message;
  }
}

export class MephistoBaseVisitor {

  protected errors: MephistoError[] = [];

  constructor(public debug = false) {
  }

  error(node: BaseNode, error: string, internalError = false) {
    const errorMessage = `${this.getErrorHeader(node, internalError)} ${error}`;
    this.errors.push(new MephistoError(errorMessage, internalError ? 'internal' : 'general'));

    // this.errors.push(`${this.getErrorHeader(node, internalError)} ${error}`);
  }

  getErrorHeader(node: BaseNode, isInternalError = false) {
    return `[${node.location.start.line}:${node.location.start.column}:${node.location.end.line}:${node.location.end.column}]${isInternalError ? ' [INTERNAL]' : ''}`;
  }

  public getErrors() {
    return this.errors;
  }

  public visit(node: BaseNode, parent?: BaseNode) {


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


    this.visitChildren(node, parent);
  }

  public visitDefinition(node: Definition, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitProgram(node: Program, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitDeclare(node: Declare, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitImport(node: Import, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitIdentifier(node: Identifier, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitBaseNode(node: BaseNode, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitCompositionExpression(node: CompositionExpression, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitWithExpression(node: WithExpression, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitLetrecExpression(node: LetrecExpression, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitBinaryExpression(node: BinaryExpression, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitApplicationExpression(node: ApplicationExpression, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitNumberPrimitive(node: NumberPrimitive, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitWirePrimitive(node: WirePrimitive, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitCutPrimitive(node: CutPrimitive, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitBroadPrimitive(node: BroadPrimitive, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitUnaryExpression(node: UnaryExpression, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitButtonControl(node: ButtonControl, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitPrecisionDeclaration(node: PrecisionDeclaration, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitCheckboxControl(node: CheckboxControl, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitVsliderControl(node: VsliderControl, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitHsliderControl(node: HsliderControl, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitNentryControl(node: NentryControl, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitVGroupControl(node: VGroupControl, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitHGroupControl(node: HGroupControl, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitTGroupControl(node: TGroupControl, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitVbargraphControl(node: VbargraphControl, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitHbargraphControl(node: HbargraphControl, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitSoundfile(node: Soundfile, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitParIteration(node: ParIteration, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitSumIteration(node: SumIteration, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitSeqIteration(node: SeqIteration, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitProdIteration(node: ProdIteration, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitAccessExpression(node: AccessExpression, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitOutputsCall(node: OutputsCall, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitInputsCall(node: InputsCall, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitPostfixDelayExpression(node: PostfixDelayExpression, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitComponent(node: Component, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitLibrary(node: Library, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitEnvironment(node: Environment, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitWaveform(node: Waveform, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitRoute(node: Route, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitForeignFunction(node: ForeignFunction, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitForeignConstant(node: ForeignConstant, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitForeignVariable(node: ForeignVariable, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitLambdaExpression(node: LambdaExpression, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitExplicitSubstitution(node: ExplicitSubstitution, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitPatternMatching(node: PatternMatching, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitPattern(node: Pattern, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitIdentifierDeclaration(node: IdentifierDeclaration, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitPatternDefinition(node: PatternDefinition, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitIterativeExpression(node: IterativeExpression, parent?: BaseNode) {
    this.visitChildren(node, parent);
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

export const mephistoVisitor = new MephistoBaseVisitor();

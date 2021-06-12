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

export class MephistoBaseVisitor {

  protected errors: string[] = [];

  constructor(public debug = false) {
  }

  error(node: BaseNode, error: string, internalError = false) {
    if (internalError && this.debug || !internalError) {
      this.errors.push(`${this.getErrorHeader(node, internalError)} ${error}`);
    }
  }

  getErrorHeader(node: BaseNode, isInternalError = false) {
    return `[${node.location.start.line}:${node.location.start.column}:${node.location.end.line}:${node.location.end.column}]${isInternalError ? ' [INTERNAL]' : ''}`;
  }

  public getErrors() {
    return this.errors;
  }

  public visit(node: BaseNode, parent?: BaseNode) {


    if (isNode(node, Definition)) {
      this.visitDefinition(node as Definition, parent);
      return;
    }

    if (isNode(node, Program)) {
      this.visitProgram(node as Program, parent);
      return;
    }

    if (isNode(node, Declare)) {
      this.visitDeclare(node as Declare, parent);
      return;
    }

    if (isNode(node, Import)) {
      this.visitImport(node as Import, parent);
      return;
    }

    if (isNode(node, Identifier)) {
      this.visitIdentifier(node as Identifier, parent);
      return;
    }

    if (isNode(node, BaseNode)) {
      this.visitBaseNode(node as BaseNode, parent);
      return;
    }

    if (isNode(node, CompositionExpression)) {
      this.visitCompositionExpression(node as CompositionExpression, parent);
      return;
    }

    if (isNode(node, WithExpression)) {
      this.visitWithExpression(node as WithExpression, parent);
      return;
    }

    if (isNode(node, LetrecExpression)) {
      this.visitLetrecExpression(node as LetrecExpression, parent);
      return;
    }

    if (isNode(node, BinaryExpression)) {
      this.visitBinaryExpression(node as BinaryExpression, parent);
      return;
    }

    if (isNode(node, ApplicationExpression)) {
      this.visitApplicationExpression(node as ApplicationExpression, parent);
      return;
    }

    if (isNode(node, NumberPrimitive)) {
      this.visitNumberPrimitive(node as NumberPrimitive, parent);
      return;
    }

    if (isNode(node, WirePrimitive)) {
      this.visitWirePrimitive(node as WirePrimitive, parent);
      return;
    }

    if (isNode(node, CutPrimitive)) {
      this.visitCutPrimitive(node as CutPrimitive, parent);
      return;
    }

    if (isNode(node, BroadPrimitive)) {
      this.visitBroadPrimitive(node as BroadPrimitive, parent);
      return;
    }

    if (isNode(node, UnaryExpression)) {
      this.visitUnaryExpression(node as UnaryExpression, parent);
      return;
    }

    if (isNode(node, ButtonControl)) {
      this.visitButtonControl(node as ButtonControl, parent);
      return;
    }

    if (isNode(node, PrecisionDeclaration)) {
      this.visitPrecisionDeclaration(node as PrecisionDeclaration, parent);
      return;
    }

    if (isNode(node, CheckboxControl)) {
      this.visitCheckboxControl(node as CheckboxControl, parent);
      return;
    }

    if (isNode(node, VsliderControl)) {
      this.visitVsliderControl(node as VsliderControl, parent);
      return;
    }

    if (isNode(node, HsliderControl)) {
      this.visitHsliderControl(node as HsliderControl, parent);
      return;
    }

    if (isNode(node, NentryControl)) {
      this.visitNentryControl(node as NentryControl, parent);
      return;
    }

    if (isNode(node, VGroupControl)) {
      this.visitVGroupControl(node as VGroupControl, parent);
      return;
    }

    if (isNode(node, HGroupControl)) {
      this.visitHGroupControl(node as HGroupControl, parent);
      return;
    }

    if (isNode(node, TGroupControl)) {
      this.visitTGroupControl(node as TGroupControl, parent);
      return;
    }

    if (isNode(node, VbargraphControl)) {
      this.visitVbargraphControl(node as VbargraphControl, parent);
      return;
    }

    if (isNode(node, HbargraphControl)) {
      this.visitHbargraphControl(node as HbargraphControl, parent);
      return;
    }

    if (isNode(node, Soundfile)) {
      this.visitSoundfile(node as Soundfile, parent);
      return;
    }

    if (isNode(node, ParIteration)) {
      this.visitParIteration(node as ParIteration, parent);
      return;
    }

    if (isNode(node, SumIteration)) {
      this.visitSumIteration(node as SumIteration, parent);
      return;
    }

    if (isNode(node, SeqIteration)) {
      this.visitSeqIteration(node as SeqIteration, parent);
      return;
    }

    if (isNode(node, ProdIteration)) {
      this.visitProdIteration(node as ProdIteration, parent);
      return;
    }

    if (isNode(node, AccessExpression)) {
      this.visitAccessExpression(node as AccessExpression, parent);
      return;
    }

    if (isNode(node, OutputsCall)) {
      this.visitOutputsCall(node as OutputsCall, parent);
      return;
    }

    if (isNode(node, InputsCall)) {
      this.visitInputsCall(node as InputsCall, parent);
      return;
    }

    if (isNode(node, PostfixDelayExpression)) {
      this.visitPostfixDelayExpression(node as PostfixDelayExpression, parent);
      return;
    }

    if (isNode(node, Component)) {
      this.visitComponent(node as Component, parent);
      return;
    }

    if (isNode(node, Library)) {
      this.visitLibrary(node as Library, parent);
      return;
    }

    if (isNode(node, Environment)) {
      this.visitEnvironment(node as Environment, parent);
      return;
    }

    if (isNode(node, Waveform)) {
      this.visitWaveform(node as Waveform, parent);
      return;
    }

    if (isNode(node, Route)) {
      this.visitRoute(node as Route, parent);
      return;
    }

    if (isNode(node, ForeignFunction)) {
      this.visitForeignFunction(node as ForeignFunction, parent);
      return;
    }

    if (isNode(node, ForeignConstant)) {
      this.visitForeignConstant(node as ForeignConstant, parent);
      return;
    }

    if (isNode(node, ForeignVariable)) {
      this.visitForeignVariable(node as ForeignVariable, parent);
      return;
    }

    if (isNode(node, LambdaExpression)) {
      this.visitLambdaExpression(node as LambdaExpression, parent);
      return;
    }

    if (isNode(node, ExplicitSubstitution)) {
      this.visitExplicitSubstitution(node as ExplicitSubstitution, parent);
      return;
    }

    if (isNode(node, PatternMatching)) {
      this.visitPatternMatching(node as PatternMatching, parent);
      return;
    }

    if (isNode(node, Pattern)) {
      this.visitPattern(node as Pattern, parent);
      return;
    }

    if (isNode(node, IdentifierDeclaration)) {
      this.visitIdentifierDeclaration(node as IdentifierDeclaration, parent);
      return;
    }

    if (isNode(node, PatternDefinition)) {
      this.visitPatternDefinition(node as PatternDefinition, parent);
      return;
    }

    if (isNode(node, IterativeExpression)) {
      this.visitIterativeExpression(node as IterativeExpression, parent);
      return;
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

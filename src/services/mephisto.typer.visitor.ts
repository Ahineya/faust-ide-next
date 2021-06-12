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
import {SymbolTable} from "./mephisto.symboltable";

export class MephistoTyperVisitor extends MephistoBaseVisitor {
  constructor(public symbolTable: SymbolTable, debug: boolean = false) {
    super(debug);
  }

  public visit(node: BaseNode, parent?: BaseNode): { ins?: number | null, outs?: number | null } | void {

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

    const insAndOuts = this.visit(node.expression);
    if (insAndOuts && typeof insAndOuts.ins === 'number' && typeof insAndOuts.outs === 'number') {
      node.insN = insAndOuts.ins;
      node.outsN = insAndOuts.outs;

      return {
        ins: node.insN,
        outs: node.outsN
      };
    }

    this.error(node, 'Definition ins and outs', true);

    return {
      ins: null,
      outs: null
    };
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
    const symbol = this.symbolTable.getWithScope(node.name, node.scopeStack);

    if (symbol?.astNode) {


      if (symbol.category === 'patternDeclaration') {
        this.error(node, `[Internal] ${node.name} VisitIdentifier : patternDeclaration`, true);

        return {
          ins: 1,
          outs: 1
        };
      }

      let insAndOuts;
      try {
        insAndOuts = this.visit(symbol.astNode);
      } catch (e) {
        console.log('SOME ERROR', e.message);
        this.error(node, e.message);

        return {
          ins: null,
          outs: null
        };
      }

      if (insAndOuts && typeof insAndOuts.ins === 'number' && typeof insAndOuts.outs === 'number') {
        node.insN = insAndOuts.ins;
        node.outsN = insAndOuts.outs;
        symbol.astNode.insN = insAndOuts.ins;
        symbol.astNode.outsN = insAndOuts.outs;

        return {
          ins: node.insN,
          outs: node.outsN
        };
      }

    }

    if (!symbol) {
      this.error(node, `Identifier not found: ${node.name}`);
      return;
    }

    this.error(node, '[Internal] Identifier ins and outs', true);

    return {
      ins: null,
      outs: null
    };
  }

  public visitBaseNode(node: BaseNode, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitCompositionExpression(node: CompositionExpression, parent?: BaseNode) {

    // const le

    // '~' | ',' | ':' | ':>' | '<:' | '+>'

    const leftInsOuts = this.visit(node.left!) as { ins: number, outs: number } | void;
    const rightInsOuts = this.visit(node.right!) as { ins: number, outs: number } | void;

    if (leftInsOuts && rightInsOuts) {
      switch (node.operator) {
        case ',':
          node.insN = leftInsOuts.ins + rightInsOuts.ins;
          node.outsN = leftInsOuts.outs + rightInsOuts.outs;

          return {
            ins: node.insN,
            outs: node.outsN
          }
        case ':':

          if (leftInsOuts.outs !== rightInsOuts.ins) {
            this.error(node, 'Composition expression error: A and B does not match');
          }

          node.insN = leftInsOuts.ins;
          node.outsN = rightInsOuts.outs;

          return {
            ins: node.insN,
            outs: node.outsN
          }
      }
    }

    this.error(node, '[Internal] CompositionExpression ins and outs');
    return {
      ins: null,
      outs: null
    };
    // this.visitChildren(node, parent);
  }

  public visitWithExpression(node: WithExpression, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitLetrecExpression(node: LetrecExpression, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitBinaryExpression(node: BinaryExpression, parent?: BaseNode) {
    const leftInsOuts = this.visit(node.left!) as { ins: number, outs: number } | void;
    const rightInsOuts = this.visit(node.right!) as { ins: number, outs: number } | void;

    if (leftInsOuts && rightInsOuts) {

      if (['^', '<<', '>>', '*', '/', '%', '+', '-', '&', '|', 'xor', '<', '<=', '>', '>=', '==', '!='].includes(node.operator)) {
        if (leftInsOuts.outs + rightInsOuts.outs > 2) {
          this.error(node, `Error in summing: A has ${leftInsOuts.outs} outputs and B has ${rightInsOuts.outs} outputs`);

          return {
            ins: null,
            outs: null
          };
        }

        node.insN = leftInsOuts.ins + rightInsOuts.ins;
        node.outsN = 1;

        return {
          ins: node.insN,
          outs: node.outsN
        }
      }

      // Other operators should go here
    }

    this.error(node, '[Internal] BinaryExpression ins and outs');
    return {
      ins: null,
      outs: null
    };
  }

  public visitApplicationExpression(node: ApplicationExpression, parent?: BaseNode) {

    if (node.callee instanceof LambdaExpression) {
      console.log('Application to lambda');
    } else {
      // Application not to lambda, need to construct CompositionExpression node.params : node.callee
      console.log('Application to whatever');

      // TODO: Here for args we need to construct Parallel Composition nodes
      // node.args.reduce((acc, curr) => {
      // }, null);

      const c = new CompositionExpression(
        ':',
        node.args,
        node.callee,
        node.location,
      );

      console.log(c);

      this.visitCompositionExpression(c);
    }

    this.visitChildren(node, parent);
  }

  public visitNumberPrimitive(node: NumberPrimitive, parent?: BaseNode) {
    node.insN = 0;
    node.outsN = 1;

    return {
      ins: node.insN,
      outs: node.outsN
    }

    // this.visitChildren(node, parent);
  }

  public visitWirePrimitive(node: WirePrimitive, parent?: BaseNode) {
    node.insN = 1;
    node.outsN = 1;

    return {
      ins: node.insN,
      outs: node.outsN
    }
  }

  public visitCutPrimitive(node: CutPrimitive, parent?: BaseNode) {
    node.insN = 1;
    node.outsN = 0;

    return {
      ins: node.insN,
      outs: node.outsN
    }
  }

  public visitBroadPrimitive(node: BroadPrimitive, parent?: BaseNode) {

    if (node.primitive === '+') {
      node.insN = 2;
      node.outsN = 1;

      return {
        ins: node.insN,
        outs: node.outsN
      }
    }

    this.error(node, `Broad primitive unknown: ${node.primitive}`, true);
    return {
      ins: null,
      outs: null,
    }
  }

  public visitUnaryExpression(node: UnaryExpression, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitButtonControl(node: ButtonControl, parent?: BaseNode) {
    node.insN = 0;
    node.outsN = 1;

    return {
      ins: node.insN,
      outs: node.outsN
    }
  }

  public visitPrecisionDeclaration(node: PrecisionDeclaration, parent?: BaseNode) {
    this.visitChildren(node, parent);
  }

  public visitCheckboxControl(node: CheckboxControl, parent?: BaseNode) {
    node.insN = 0;
    node.outsN = 1;

    return {
      ins: node.insN,
      outs: node.outsN
    }
  }

  public visitVsliderControl(node: VsliderControl, parent?: BaseNode) {
    node.insN = 0;
    node.outsN = 1;

    return {
      ins: node.insN,
      outs: node.outsN
    }
  }

  public visitHsliderControl(node: HsliderControl, parent?: BaseNode) {
    node.insN = 0;
    node.outsN = 1;

    return {
      ins: node.insN,
      outs: node.outsN
    }
  }

  public visitNentryControl(node: NentryControl, parent?: BaseNode) {
    node.insN = 0;
    node.outsN = 1;

    return {
      ins: node.insN,
      outs: node.outsN
    }
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
    node.insN = 1;
    node.outsN = 1;

    return {
      ins: node.insN,
      outs: node.outsN
    }
  }

  public visitHbargraphControl(node: HbargraphControl, parent?: BaseNode) {
    node.insN = 1;
    node.outsN = 1;

    return {
      ins: node.insN,
      outs: node.outsN
    }
  }

  public visitSoundfile(node: Soundfile, parent?: BaseNode) {
    node.insN = 1;
    node.outsN = 2 + 0; /// visit outsN node.outsN || 0;

    return {
      ins: node.insN,
      outs: node.outsN
    }
  }

  public visitParIteration(node: ParIteration, parent?: BaseNode) {

    // visit node.

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

    const nonAppliedLambdaInsOuts = this.visit(node.expression);

    if (nonAppliedLambdaInsOuts) {
      if (nonAppliedLambdaInsOuts.ins && nonAppliedLambdaInsOuts.outs) {
        node.insN = nonAppliedLambdaInsOuts.ins;
        node.outsN = nonAppliedLambdaInsOuts.outs;

        return {
          ins: node.insN,
          outs: node.outsN
        }
      }

      this.error(node, 'Unknown lambda ins and outs');

      return {
        ins: null,
        outs: null
      }
    }

    this.error(node, '[Internal] Unknown lambda error', true);

    return {
      ins: null,
      outs: null
    }
    //this.visitChildren(node, parent);
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
      return null;
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

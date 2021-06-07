import FaustParserVisitor from "./generated/FaustParserVisitor.js";
import {
  ArglistContext, ArgumentContext, ButtonContext,
  DefinitionContext, DefnameContext, ExpressionContext, IdentContext,
  ImportStatementContext,
  InfixexprContext, PrimitiveContext, ProgramContext, RecinitionContext, ReclistContext, RecnameContext,
  StatementContext, UqstringContext,
  VariantContext, VariantstatementContext, WithdefContext
} from "./generated/FaustParser.js";
import {
  DeclareNode,
  DefinitionNode,
  CompositionExpressionNode,
  ImportNode,
  IPosition,
  ProgramNode,
  VariantStatementNode,
  WithExpressionNode,
  LetrecExpressionNode,
  ExpressionStubNode,
  BinaryExpressionNode,
  ExpressionNode,
  PrimitiveNumberNode,
  PrimitiveStubNode,
  PrimitiveNode,
  IdentifierNode,
  ApplicationExpressionNode, InfixExpressionNode, ButtonNode, ControlErrorNode, PrimitiveExpressionWrapperNode, Node
} from "./ast/nodes.interface";

const EOF = "<EOF>";

export class FaustVisitor extends FaustParserVisitor {

  constructor() {
    super();
  }

  // Visit a parse tree produced by FaustParser#program.
  visitProgram(ctx: ProgramContext): ProgramNode {
    // Do not forget, that program might contain variantstatements as well

    const statements: (DefinitionNode | ImportNode | DeclareNode)[] = this.visitChildren(ctx)
      .filter((s: DefinitionNode | ImportNode | DeclareNode | string) => s !== EOF);

    return {
      type: 'ProgramNode',
      body: {
        definitions: statements.filter(s => s.type === "DefinitionNode") as DefinitionNode[],
        imports: statements.filter(s => s.type === "ImportNode") as ImportNode[],
        declares: statements.filter(s => s.type === "DeclareNode") as DeclareNode[]
      },
      ...this.getPosition(ctx)
    };
  }


  // Visit a parse tree produced by FaustParser#variant.
  visitVariant(ctx: VariantContext) {
    console.log('variant returns stub');
    return "stub";
  }


  visitImportStatement(ctx: ImportStatementContext) {
    // implemented
    return this.visitUqstring(ctx.importName);
  }


  visitStatement(ctx: StatementContext): DefinitionNode | ImportNode | DeclareNode {

    if (ctx.def) {
      const definition = this.visitDefinition(ctx.def);
      return {
        type: 'DefinitionNode',
        id: definition.id,
        expr: definition.expr,
        args: definition.args,
        ...this.getPosition(ctx)
      }
    }

    if (ctx.imp) {
      return {
        type: 'ImportNode',
        import: this.visitImportStatement(ctx.imp),
        ...this.getPosition(ctx)
      }
    }

    if (ctx.decname) {
      return {
        type: 'DeclareNode',
        name: ctx.decname,
        fnName: ctx.decarg,
        value: ctx.decval,
        ...this.getPosition(ctx)
      }
    }

    throw new Error('Statement is neither DefinitionNode | ImportNode | DeclareNode');
  }


  // Visit a parse tree produced by FaustParser#variantstatement.
  visitVariantstatement(ctx: VariantstatementContext): VariantStatementNode {

    const precision = this.visitVariant(ctx.precision);
    const variantStatement = this.visitStatement(ctx.variantStatement);

    return {
      type: 'VariantStatementNode',
      precision,
      body: variantStatement,
      ...this.getPosition(ctx)
    }
  }

  // Visit a parse tree produced by FaustParser#definition.
  visitDefinition(ctx: DefinitionContext): DefinitionNode {

    const args = ctx.args
      ? this.visitArglist(ctx.args)
      : null;

    // TODO: with some errors ctx.identname can be empty. Error case: "a 1 + 1"

    return {
      type: 'DefinitionNode',
      args,
      id: this.visitIdent(ctx.identname),
      expr: this.visitExpression(ctx.expr),
      ...this.getPosition(ctx)
    }

    // return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#defname.
  visitDefname(ctx: DefnameContext) {
    console.log('VisitDefName not implemented');
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#arglist.
  visitArglist(ctx: ArglistContext): Node {
    if (ctx.list && ctx.op && ctx.arg) {
      return {
        type: "CompositionExpressionNode",
        operator: ctx.op.text,
        left: this.visitArglist(ctx.list),
        right: this.visitArgument(ctx.arg),
        ...this.getPosition(ctx)
      }
    }

    if (ctx.arg) {
      return this.visitArgument(ctx.arg);
    }

    console.log();

    return {
      type: "ExpressionStubNode",
      ...this.getPosition(ctx)
    }
  }


  visitReclist(ctx: ReclistContext): DefinitionNode[] {
    // Implemented
    return this.visitChildren(ctx);
  }

  visitRecinition(ctx: RecinitionContext): DefinitionNode {
    return {
      type: 'DefinitionNode',
      recursive: true,
      args: null,
      id: this.visitRecname(ctx.identname),
      expr: this.visitExpression(ctx.expr),
      ...this.getPosition(ctx)
    }
  }


  visitRecname(ctx: RecnameContext): IdentifierNode {
    // Implemented
    return this.visitIdent(ctx.identname);
  }

  // Visit a parse tree produced by FaustParser#deflist.
  visitDeflist(ctx: any) {
    console.log("visitDeflist not implemented");
    return this.visitChildren(ctx);
  }


  visitArgument(ctx: ArgumentContext): Node {

    if (ctx.op && ctx.left && ctx.right) {
      return {
        type: "CompositionExpressionNode",
        operator: ctx.op.text,
        left: this.visitArglist(ctx.left),
        right: this.visitArglist(ctx.right),
        ...this.getPosition(ctx)
      }
    }

    if (ctx.expr) {
      return this.visitInfixexpr(ctx.expr)
    }

    console.log("ARGUMENT ERROR: returning stub node");

    return {
      type: "ExpressionStubNode",
      ...this.getPosition(ctx)
    }
  }


  // Visit a parse tree produced by FaustParser#params.
  visitParams(ctx: any) {
    console.log('Visit params not implemented');
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#expression.
  visitExpression(ctx: ExpressionContext): ExpressionNode | InfixExpressionNode {

    if (ctx.infexpr) {
      return this.visitInfixexpr(ctx.infexpr);
    }

    if (ctx.op.text === 'with') {
      return {
        type: "WithExpressionNode",
        expr: this.visitExpression(ctx.expr),
        context: ctx.defs.getChildCount() === 0 ? [] : this.visitWithdef(ctx.defs),
        ...this.getPosition(ctx)
      }
    }

    if (ctx.op.text === 'letrec') {
      return {
        type: "LetrecExpressionNode",
        expr: this.visitExpression(ctx.expr),
        context: ctx.recs.getChildCount() === 0 ? [] : this.visitReclist(ctx.recs),
        ...this.getPosition(ctx)
      }
    }

    if (ctx.right) {
      // CompositionExpression

      return {
        type: "CompositionExpressionNode",
        operator: ctx.op.text,
        left: this.visitExpression(ctx.left),
        right: this.visitExpression(ctx.right),
        ...this.getPosition(ctx)
      }
    }

    console.log("EXPRESSION ERROR, returning stub");

    return {
      type: 'ExpressionStubNode',
      ...this.getPosition(ctx)
    }
  }

  visitWithdef(ctx: WithdefContext): DefinitionNode[] {
    // implemented
    // Valid, since withdef is an alias for (definition | variangdefinition)*
    return this.visitChildren(ctx);
  }

  visitInfixexpr(ctx: InfixexprContext): InfixExpressionNode | PrimitiveExpressionWrapperNode | PrimitiveNode | ExpressionNode {
    if (ctx.right) {
      // BinaryExpressionNode

      return {
        type: 'BinaryExpressionNode',
        operator: ctx.op.text,
        left: this.visitInfixexpr(ctx.left),
        right: this.visitInfixexpr(ctx.right),
        ...this.getPosition(ctx)
      }
    }

    if (ctx.definitions || ctx.expr) {
      return {
        type: 'ExpressionStubNode',
        text: '[STUB] InfixExpr function, substitution and delay stub',
        ...this.getPosition(ctx)
      }
    }

    if (ctx.prim) {
        return this.visitPrimitive(ctx.prim);
    }

    if (ctx.arguments) {
      const args = ctx.arguments
        ? this.visitArglist(ctx.arguments)
        : null;

      return {
        type: "ApplicationExpressionNode",
        args,
        callee: this.visitInfixexpr(ctx.callee),
        ...this.getPosition(ctx)
      }
    }

    console.log("INFIX EXPRESSION ERROR, returning stub");

    return {
      type: 'ExpressionStubNode',
      ...this.getPosition(ctx)
    }
  }


  visitPrimitive(ctx: PrimitiveContext): PrimitiveNode | ExpressionNode | null {
    if (ctx.value) {
      return {
        type: "PrimitiveNumberNode",
        value: parseFloat((ctx.sign?.text || '') + ctx.value.text),
        ...this.getPosition(ctx)
      }
    }

    if (ctx.wire) {
      return {
        type: "PrimitiveWireNode",
        ...this.getPosition(ctx)
      }
    }

    if (ctx.cut) {
      return {
        type: "PrimitiveCutNode",
        ...this.getPosition(ctx)
      }
    }

    if (ctx.primitivetype) {
      return {
        type: "PrimitiveTypeNode",
        primitive: ctx.primitivetype,
        ...this.getPosition(ctx)
      }
    }

    if (ctx.primitiveident) {
      if (ctx.sign) {
        return {
          type: "PrimitiveNegativeIdentifierNode",
          id: this.visitIdent(ctx.primitiveident),
          ...this.getPosition(ctx)
        }
      }

      return {
        type: "PrimitivePositiveIdentifierNode",
        id: this.visitIdent(ctx.primitiveident),
        ...this.getPosition(ctx)
      }
    }


    const firstChild = ctx.getChild(0);

    if (firstChild instanceof ButtonContext) {
      return this.visitButton(firstChild);
    }

    if (ctx.primitiveexpr) {
      return {
        type: "PrimitiveExpressionWrapperNode",
        expr: this.visitExpression(ctx.primitiveexpr),
        ...this.getPosition(ctx)
      };
    }

    console.log("ERROR: primitive not found, returning stub node");

    return {
      type: "PrimitiveStubNode",
      ...this.getPosition(ctx)
    }

  }


  // Visit a parse tree produced by FaustParser#ffunction.
  visitFfunction(ctx: any) {
    console.log("visitFfunction: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#fconst.
  visitFconst(ctx: any) {
    console.log("visitFconst: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#fvariable.
  visitFvariable(ctx: any) {
    console.log("visitFvariable: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#button.
  visitButton(ctx: ButtonContext): ButtonNode | ControlErrorNode {

    if (ctx.caption) {
      return {
        type: "ButtonNode",
        label: this.visitUqstring(ctx.caption),
        ...this.getPosition(ctx)
      }
    }

    console.log('ERROR: Parse button failed');

    return {
      type: 'ControlErrorNode',
      error: 'Button error',
    }
  }


  // Visit a parse tree produced by FaustParser#checkbox.
  visitCheckbox(ctx: any) {
    console.log("visitCheckbox: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#vslider.
  visitVslider(ctx: any) {
    console.log("visitVslider: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#hslider.
  visitHslider(ctx: any) {
    console.log("visitHslider: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#nentry.
  visitNentry(ctx: any) {
    console.log("visitNentry: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#vgroup.
  visitVgroup(ctx: any) {
    console.log("visitVgroup: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#hgroup.
  visitHgroup(ctx: any) {
    console.log("visitHgroup: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#tgroup.
  visitTgroup(ctx: any) {
    console.log("visitTgroup: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#vbargraph.
  visitVbargraph(ctx: any) {
    console.log("visitVbargraph: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#hbargraph.
  visitHbargraph(ctx: any) {
    console.log("visitHbargraph: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#soundfile.
  visitSoundfile(ctx: any) {
    console.log("visitSoundfile: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#fpar.
  visitFpar(ctx: any) {
    console.log("visitFpar: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#fseq.
  visitFseq(ctx: any) {
    console.log("visitFseq: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#fsum.
  visitFsum(ctx: any) {
    console.log("visitFsum: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#fprod.
  visitFprod(ctx: any) {
    console.log("visitProd: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#finputs.
  visitFinputs(ctx: any) {
    console.log("visitFinputs: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#foutputs.
  visitFoutputs(ctx: any) {
    console.log("visitFoutputs: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#caserulelist.
  visitCaserulelist(ctx: any) {
    console.log("visitCaserulelist: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#caserule.
  visitCaserule(ctx: any) {
    console.log("visitCaserule: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#ident.
  visitIdent(ctx: IdentContext): IdentifierNode {
    if (!ctx) {
      console.log("IDENTIFIER ERROR");
    }
    return {
      type: "IdentifierNode",
      name: ctx.getText(),
      ...this.getPosition(ctx)
    };
  }


  // Visit a parse tree produced by FaustParser#uqstring.
  visitUqstring(ctx: UqstringContext): string {
    return ctx.getText();
  }


  // Visit a parse tree produced by FaustParser#fstring.
  visitFstring(ctx: any) {
    console.log("visitFstring: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#vallist.
  visitVallist(ctx: any) {
    console.log("visitVallist: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#number.
  visitNumber(ctx: any) {
    console.log("visitNumber: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#string.
  visitString(ctx: any) {
    console.log("visitString: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#name.
  visitName(ctx: any) {
    console.log("visitName: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#type.
  visitType(ctx: any) {
    console.log("visitType: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#signature.
  visitSignature(ctx: any) {
    console.log("visitSignature: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#fun.
  visitFun(ctx: any) {
    console.log("visitFun: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#singleprecisionfun.
  visitSingleprecisionfun(ctx: any) {
    console.log("visitSingleprecisionfun: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#doubleprecisionfun.
  visitDoubleprecisionfun(ctx: any) {
    console.log("visitDoubleprecisionfun: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#quadprecisionfun.
  visitQuadprecisionfun(ctx: any) {
    console.log("visitQuadprecisionfun: not implemented");
    return this.visitChildren(ctx);
  }


  // Visit a parse tree produced by FaustParser#typelist.
  visitTypelist(ctx: any) {
    console.log("visitTypelist: not implemented");
    return this.visitChildren(ctx);
  }

  visitTerminal(ctx: any) {
    return EOF;
  }

  private visitChildren(ctx: any) {
    // @ts-ignore
    return super.visitChildren(ctx);
  }

  private getPosition(ctx: any): IPosition {
    return {
      start: {
        line: ctx.start.line,
        column: ctx.start.column
      },
      end: {
        line: ctx.stop.line,
        column: ctx.stop.column
      }
    }
  }
}
import FaustParserVisitor from "./generated/FaustParserVisitor.js";
import {
  ArglistContext,
  ArgumentContext,
  ButtonContext, CaseruleContext,
  CheckboxContext,
  DefinitionContext, DeflistContext,
  DefnameContext,
  ExpressionContext, FconstContext, FfunctionContext, FinputsContext, FoutputsContext,
  FparContext,
  FprodContext,
  FseqContext, FstringContext,
  FsumContext, FunContext, FvariableContext,
  HbargraphContext,
  HgroupContext,
  HsliderContext,
  IdentContext,
  ImportStatementContext,
  InfixexprContext,
  NameContext,
  NentryContext, NumberContext, ParamsContext,
  PrimitiveContext,
  ProgramContext,
  RecinitionContext,
  ReclistContext,
  RecnameContext, SignatureContext,
  SoundfileContext,
  StatementContext,
  StringContext,
  TgroupContext, TypeContext, TypelistContext,
  UqstringContext,
  VallistContext,
  VariantContext,
  VariantstatementContext,
  VbargraphContext,
  VgroupContext,
  VsliderContext,
  WithdefContext
} from "./generated/FaustParser.js";
import {
  ILocation,
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
  Pattern
} from "./ast/nodes.interface.js";

const EOF = "<EOF>";

export class FaustVisitor extends FaustParserVisitor {

  constructor() {
    super();
  }

  // Visit a parse tree produced by FaustParser#program.
  visitProgram(ctx: ProgramContext): Program {
    // Do not forget, that program might contain variantstatements as well

    const body: (Definition | Import | Declare)[] = (this.visitChildren(ctx) as (Definition | Import | Declare | string)[])
      .filter(s => s !== EOF) as unknown as (Definition | Import | Declare)[];

    const location = this.getLocation(ctx);

    return new Program(body, location);
  }


  // Visit a parse tree produced by FaustParser#variant.
  visitVariant(ctx: VariantContext): string | null {
    if (ctx.precision) {
      return ctx.precision.text;
    }

    return null;
  }

  visitImportStatement(ctx: ImportStatementContext): Import {
    const filename = this.visitUqstring(ctx.importName);
    return new Import(filename, this.getLocation(ctx));
  }

  visitStatement(ctx: StatementContext): Definition | Import | Declare | null {

    if (ctx.def instanceof DefinitionContext) {
      return this.visitDefinition(ctx.def);
    }

    if (ctx.imp instanceof ImportStatementContext) {
      return this.visitImportStatement(ctx.imp)
    }

    if (
      ctx.decname instanceof NameContext
      && ctx.decval instanceof StringContext
    ) {
      const name = this.visitName(ctx.decname);
      const fnName = ctx.decarg ?
        this.visitName(ctx.decarg)
        : null;
      const value = this.visitString(ctx.decval);

      return new Declare(fnName, name, value, this.getLocation(ctx));
    }

    console.log("ERROR: Parsing statement");

    return null;
  }


  visitVariantstatement(ctx: VariantstatementContext): PrecisionDeclaration {
    const precisions: (string | null)[] = ctx.variant().map((v: VariantContext) => this.visitVariant(v));
    const declaration = this.visitStatement(ctx.variantStatement);

    return new PrecisionDeclaration(precisions, declaration, this.getLocation(ctx));
  }

  visitDefinition(ctx: DefinitionContext): Definition | null {

    const args = ctx.args
      ? this.visitArglist(ctx.args)
      : null;

    if (ctx.identname && ctx.expr) {
      const id = this.visitDefname(ctx.identname);
      const expression = this.visitExpression(ctx.expr);

      return new Definition(id, args, false, expression, this.getLocation(ctx));
    }

    console.log("ERROR Parsing Definition");

    return null;
  }


  // Visit a parse tree produced by FaustParser#defname.
  visitDefname(ctx: DefnameContext): BaseNode | null {
    return this.visitIdent(ctx.ident());
  }

  visitArglist(ctx: ArglistContext): (BaseNode | null)[] {
    if (ctx.list && ctx.op && ctx.arg) {
      const list = this.visitArglist(ctx.list);
      const arg = this.visitArgument(ctx.arg);

      return [...list, arg];
    }

    if (ctx.arg) {
      return [this.visitArgument(ctx.arg)];
    }

    console.log("Error parsing args");

    return [null];
  }


  visitReclist(ctx: ReclistContext): Definition[] {
    // Implemented
    return this.visitChildren(ctx);
  }

  visitRecinition(ctx: RecinitionContext): Definition | null {
    if (ctx.identname && ctx.expr) {
      const id = this.visitRecname(ctx.identname);
      const expression = this.visitExpression(ctx.expr);

      return new Definition(id, null, true, expression, this.getLocation(ctx));
    }

    console.log("Error: Recinition. Return null");

    return null;
  }


  visitRecname(ctx: RecnameContext): Identifier {
    return this.visitIdent(ctx.identname);
  }

  // Visit a parse tree produced by FaustParser#deflist.
  visitDeflist(ctx: DeflistContext) {
    if (ctx.def) {
      const precisions: (string | null)[] = ctx.variant().map((v: VariantContext) => this.visitVariant(v));
      const declaration = this.visitDefinition(ctx.def);

      return new PrecisionDeclaration(precisions, declaration, this.getLocation(ctx));
    }

    if (ctx.def) {
      return this.visitDefinition(ctx.def);
    }

    console.log('ERROR parse deflist');

    return null;
  }

  visitArgument(ctx: ArgumentContext): BaseNode | null {
    if (ctx.op && ctx.left && ctx.right) {
      const operator = ctx.op.text;
      const left = this.visitArgument(ctx.left);
      const right = this.visitArgument(ctx.right)

      return new CompositionExpression(operator, left, right, this.getLocation(ctx));
    }

    if (ctx.expr) {
      return this.visitInfixexpr(ctx.expr);
    }

    console.log("ARGUMENT ERROR: returning stub node");

    return null;
  }


  visitParams(ctx: ParamsContext): (Identifier | null)[] | null {
    if (ctx.id && ctx.pars) {
      const params = this.visitParams(ctx.pars);

      if (!params) {
        console.log("ERROR: Visit lambda params");
        return null;
      }

      return [...params, this.visitIdent(ctx.id)];
    }

    if (ctx.id) {
      return [this.visitIdent(ctx.id)];
    }

    console.log("ERROR: Visit lambda params");

    return null;
  }


  // Visit a parse tree produced by FaustParser#expression.
  visitExpression(ctx: ExpressionContext): BaseNode | null {

    if (ctx.infexpr) {
      return this.visitInfixexpr(ctx.infexpr);
    }

    if (ctx.expr && ctx.op.text === 'with') {

      const expression = this.visitExpression(ctx.expr);
      const context = ctx.defs.getChildCount() === 0
        ? []
        : this.visitWithdef(ctx.defs);

      return new WithExpression(
        expression,
        context,
        this.getLocation(ctx)
      )
    }

    if (ctx.expr && ctx.op.text === 'letrec') {
      const expression = this.visitExpression(ctx.expr);
      const context = ctx.recs.getChildCount() === 0
        ? []
        : this.visitReclist(ctx.recs);

      return new LetrecExpression(expression, context, this.getLocation(ctx));
    }

    if (ctx.op && ctx.right) {
      const operator = ctx.op.text;
      const left = this.visitExpression(ctx.left);
      const right = this.visitExpression(ctx.right);

      return new CompositionExpression(operator, left, right, this.getLocation(ctx));
    }

    console.log("EXPRESSION ERROR, returning stub");

    return null;
  }

  visitWithdef(ctx: WithdefContext): Definition[] {
    // implemented
    // Valid, since withdef is an alias for (definition | variantdefinition)*
    return this.visitChildren(ctx);
  }

  visitInfixexpr(ctx: InfixexprContext): BaseNode | null {
    if (ctx.left && ctx.definitions) {
      const expr = this.visitInfixexpr(ctx.left);

      const definitions = ctx.deflist()
        .map((definition: DeflistContext) => this.visitDeflist(definition));

      return new ExplicitSubstitution(
        definitions,
        expr,
        this.getLocation(ctx)
      )
    }

    if (ctx.op && ctx.expr) {
      const operator = ctx.op.text;

      if (operator === "'") {
        return new PostfixDelayExpression(
          this.visitInfixexpr(ctx.expr),
          this.getLocation(ctx)
        );
      }

      console.log('ERROR: Unrecognized postfix expression');
      return null;
    }

    if (ctx.op && ctx.left && ctx.right) {
      const operator = ctx.op.text;
      const left = this.visitInfixexpr(ctx.left);
      const right = this.visitInfixexpr(ctx.right);

      return new BinaryExpression(operator, left, right, this.getLocation(ctx));
    }

    if (ctx.prim) {
      return this.visitPrimitive(ctx.prim);
    }

    if (ctx.callee && ctx.arguments) {
      const args = ctx.arguments
        ? this.visitArglist(ctx.arguments)
        : null;

      const callee = this.visitInfixexpr(ctx.callee)

      return new ApplicationExpression(args, callee, this.getLocation(ctx));
    }

    if (ctx.left && ctx.identificator) {
      return new AccessExpression(
        this.visitInfixexpr(ctx.left),
        this.visitIdent(ctx.identificator),
        this.getLocation(ctx)
      )
    }

    console.log("INFIX EXPRESSION ERROR");

    return null;
  }


  visitPrimitive(ctx: PrimitiveContext): BaseNode | null {
    if (ctx.value) {
      const sign = ctx.sign?.text || '';
      const value = parseFloat(`${sign}${ctx.value.text}`);

      return new NumberPrimitive(value, this.getLocation(ctx));
    }

    if (ctx.wire) {
      return new WirePrimitive(this.getLocation(ctx));
    }

    if (ctx.cut) {
      return new CutPrimitive(this.getLocation(ctx));
    }

    if (ctx.primitivetype) {
      const primitivetype = ctx.primitivetype.text;
      return new BroadPrimitive(primitivetype, this.getLocation(ctx));
    }

    if (ctx.primitiveident) {
      const identificator = this.visitIdent(ctx.primitiveident);

      if (ctx.sign) {
        return new UnaryExpression("-", identificator, this.getLocation(ctx));
      }

      return identificator;
    }

    const firstChild = ctx.getChild(0);

    if (firstChild instanceof ButtonContext) {
      return this.visitButton(firstChild);
    }

    if (firstChild instanceof CheckboxContext) {
      return this.visitCheckbox(firstChild);
    }

    if (firstChild instanceof NentryContext) {
      return this.visitNentry(firstChild);
    }

    if (firstChild instanceof VsliderContext) {
      return this.visitVslider(firstChild);
    }

    if (firstChild instanceof HsliderContext) {
      return this.visitHslider(firstChild);
    }

    if (firstChild instanceof VgroupContext) {
      return this.visitVgroup(firstChild);
    }

    if (firstChild instanceof HgroupContext) {
      return this.visitHgroup(firstChild);
    }

    if (firstChild instanceof TgroupContext) {
      return this.visitTgroup(firstChild);
    }

    if (firstChild instanceof VbargraphContext) {
      return this.visitVbargraph(firstChild);
    }

    if (firstChild instanceof HbargraphContext) {
      return this.visitHbargraph(firstChild);
    }

    if (firstChild instanceof FsumContext) {
      return this.visitFsum(firstChild);
    }

    if (firstChild instanceof FseqContext) {
      return this.visitFseq(firstChild);
    }

    if (firstChild instanceof FparContext) {
      return this.visitFpar(firstChild);
    }

    if (firstChild instanceof FprodContext) {
      return this.visitFprod(firstChild);
    }

    if (firstChild instanceof FinputsContext) {
      return this.visitFinputs(firstChild);
    }

    if (firstChild instanceof FoutputsContext) {
      return this.visitFoutputs(firstChild);
    }

    if (firstChild instanceof FfunctionContext) {
      return this.visitFfunction(firstChild);
    }

    if (firstChild instanceof FconstContext) {
      return this.visitFconst(firstChild);
    }

    if (firstChild instanceof FvariableContext) {
      return this.visitFvariable(firstChild);
    }

    if (ctx.primitiveexpr) {
      return this.visitExpression(ctx.primitiveexpr);
    }

    if (ctx.lambdaparams && ctx.expr) {
      const params = this.visitParams(ctx.lambdaparams);

      if (!params) {
        console.log('ERROR: Lambda expression');
        return null;
      }

      return new LambdaExpression(
        params,
        this.visitExpression(ctx.expr),
        this.getLocation(ctx)
      );
    }

    if (ctx.source) {
      if (ctx.component) {
        return new Component(
          this.visitUqstring(ctx.source),
          this.getLocation(ctx)
        );
      }

      if (ctx.library) {
        return new Library(
          this.visitUqstring(ctx.source),
          this.getLocation(ctx)
        );
      }

      console.log('ERROR: parsing component or library');

      return null;
    }

    if (ctx.waveform && ctx.values) {
      return new Waveform(
        this.visitVallist(ctx.values),
        this.getLocation(ctx)
      )
    }

    if (ctx.route && ctx.ins && ctx.outs && ctx.pairs) {
      return new Route(
        this.visitArgument(ctx.ins),
        this.visitArgument(ctx.outs),
        this.visitExpression(ctx.pairs),
        this.getLocation(ctx)
      );
    }

    if (ctx.environment) {

      const environmentBody: (Definition | Import | Declare)[] = (this.visitChildren(ctx) as (Definition | Import | Declare | string)[])
        .filter(s => s !== EOF) as unknown as (Definition | Import | Declare)[];

      return new Environment(
        environmentBody,
        this.getLocation(ctx)
      );
    }

    if (ctx.patterns) {
      const patterns = ctx.caserule().map((p: CaseruleContext) => this.visitCaserule(p));

      return new PatternMatching(
        patterns,
        this.getLocation(ctx)
      );
    }

    console.log("ERROR: primitive not found, returning null");

    return null;

  }


  visitFfunction(ctx: FfunctionContext) {
    if (ctx.sign && ctx.header && ctx.str) {

      const signature = this.visitSignature(ctx.sign);
      const header = this.visitFstring(ctx.header);
      const str = this.visitString(ctx.str);

      return new ForeignFunction(
        signature?.fnType || null,
        signature?.fn || null,
        signature?.fnTypelist || null,
        header,
        str,
        this.getLocation(ctx)
      )
    }

    console.log('ERROR: Parse ffunction');
    return null;
  }


  visitFconst(ctx: FconstContext) {
    if (ctx.ctype && ctx.cname && ctx.cstring) {
      return new ForeignConstant(
        this.visitType(ctx.ctype),
        this.visitName(ctx.cname),
        this.visitFstring(ctx.cstring),
        this.getLocation(ctx)
      )
    }

    console.log('ERROR: parse fconst');
    return null;
  }


  visitFvariable(ctx: FvariableContext) {
    if (ctx.vtype && ctx.vname && ctx.vstring) {
      return new ForeignVariable(
        this.visitType(ctx.vtype),
        this.visitName(ctx.vname),
        this.visitFstring(ctx.vstring),
        this.getLocation(ctx)
      )
    }

    console.log('ERROR: parse fvariable');

    return this.visitChildren(ctx);
  }


  visitButton(ctx: ButtonContext): BaseNode | null {
    if (ctx.caption) {
      const label = this.visitUqstring(ctx.caption);
      return new ButtonControl(label, this.getLocation(ctx));
    }

    console.log('ERROR: Parse button failed');

    return null;
  }


  // Visit a parse tree produced by FaustParser#checkbox.
  visitCheckbox(ctx: CheckboxContext): BaseNode | null {
    if (ctx.caption) {
      const label = this.visitUqstring(ctx.caption);
      return new CheckboxControl(label, this.getLocation(ctx));
    }

    console.log('ERROR: Parse checkbox failed');
    return null;
  }


  visitVslider(ctx: VsliderContext): BaseNode | null {
    if (ctx.caption && ctx.initial && ctx.min && ctx.max && ctx.step) {
      return new VsliderControl(
        this.visitUqstring(ctx.caption),
        this.visitArgument(ctx.initial),
        this.visitArgument(ctx.min),
        this.visitArgument(ctx.max),
        this.visitArgument(ctx.step),
        this.getLocation(ctx)
      )
    }

    console.log('ERROR: Parse Vslider failed');
    return null;
  }


  // Visit a parse tree produced by FaustParser#hslider.
  visitHslider(ctx: HsliderContext): BaseNode | null {
    if (ctx.caption && ctx.initial && ctx.min && ctx.max && ctx.step) {
      return new HsliderControl(
        this.visitUqstring(ctx.caption),
        this.visitArgument(ctx.initial),
        this.visitArgument(ctx.min),
        this.visitArgument(ctx.max),
        this.visitArgument(ctx.step),
        this.getLocation(ctx)
      )
    }

    console.log('ERROR: Parse Vslider failed');
    return null;
  }


  // Visit a parse tree produced by FaustParser#nentry.
  visitNentry(ctx: any) {
    if (ctx.caption && ctx.initial && ctx.min && ctx.max && ctx.step) {
      return new NentryControl(
        this.visitUqstring(ctx.caption),
        this.visitArgument(ctx.initial),
        this.visitArgument(ctx.min),
        this.visitArgument(ctx.max),
        this.visitArgument(ctx.step),
        this.getLocation(ctx)
      )
    }

    console.log('ERROR: Parse Vslider failed');
    return null;
  }


  // Visit a parse tree produced by FaustParser#vgroup.
  visitVgroup(ctx: VgroupContext) {
    if (ctx.caption && ctx.expr) {
      return new VGroupControl(
        this.visitUqstring(ctx.caption),
        this.visitExpression(ctx.expr),
        this.getLocation(ctx)
      );
    }

    console.log('ERROR: Building AST for vgroup');

    return null;
  }


  // Visit a parse tree produced by FaustParser#hgroup.
  visitHgroup(ctx: HgroupContext) {
    if (ctx.caption && ctx.expr) {
      return new HGroupControl(
        this.visitUqstring(ctx.caption),
        this.visitExpression(ctx.expr),
        this.getLocation(ctx)
      );
    }

    console.log('ERROR: Building AST for hgroup');

    return null;
  }


  // Visit a parse tree produced by FaustParser#tgroup.
  visitTgroup(ctx: TgroupContext) {
    if (ctx.caption && ctx.expr) {
      return new TGroupControl(
        this.visitUqstring(ctx.caption),
        this.visitExpression(ctx.expr),
        this.getLocation(ctx)
      );
    }

    console.log('ERROR: Building AST for tgroup');

    return null;
  }


  visitVbargraph(ctx: VbargraphContext) {

    if (ctx.caption && ctx.min && ctx.max) {
      return new VbargraphControl(
        this.visitUqstring(ctx.caption),
        this.visitArgument(ctx.min),
        this.visitArgument(ctx.max),
        this.getLocation(ctx)
      )
    }

    console.log('ERROR parsing vbargraph');
    return null;
  }


  visitHbargraph(ctx: HbargraphContext) {

    if (ctx.caption && ctx.min && ctx.max) {
      return new HbargraphControl(
        this.visitUqstring(ctx.caption),
        this.visitArgument(ctx.min),
        this.visitArgument(ctx.max),
        this.getLocation(ctx)
      )
    }

    console.log('ERROR parsing hbargraph');
    return null;
  }


  visitSoundfile(ctx: SoundfileContext) {
    if (ctx.caption && ctx.outs) {
      return new Soundfile(
        this.visitUqstring(ctx.caption),
        this.visitArgument(ctx.outs),
        this.getLocation(ctx)
      );
    }

    console.log("ERROR: Parsing soundfile");
    return null;
  }


  // Visit a parse tree produced by FaustParser#fpar.
  visitFpar(ctx: FparContext) {
    if (ctx.id && ctx.arg && ctx.expr) {
      return new ParIteration(
        this.visitIdent(ctx.id),
        this.visitArgument(ctx.arg),
        this.visitExpression(ctx.expr),
        this.getLocation(ctx)
      );
    }

    console.log('ERROR: visitFpar');
    return null;
  }


  // Visit a parse tree produced by FaustParser#fseq.
  visitFseq(ctx: FseqContext) {
    if (ctx.id && ctx.arg && ctx.expr) {
      return new SeqIteration(
        this.visitIdent(ctx.id),
        this.visitArgument(ctx.arg),
        this.visitExpression(ctx.expr),
        this.getLocation(ctx)
      );
    }

    console.log('ERROR: visitFseq');
    return null;
  }

  visitFsum(ctx: FsumContext) {
    if (ctx.id && ctx.arg && ctx.expr) {
      return new SumIteration(
        this.visitIdent(ctx.id),
        this.visitArgument(ctx.arg),
        this.visitExpression(ctx.expr),
        this.getLocation(ctx)
      );
    }

    console.log('ERROR: visitFsum');
    return null;
  }

  visitFprod(ctx: FprodContext) {
    if (ctx.id && ctx.arg && ctx.expr) {
      return new ProdIteration(
        this.visitIdent(ctx.id),
        this.visitArgument(ctx.arg),
        this.visitExpression(ctx.expr),
        this.getLocation(ctx)
      );
    }

    console.log('ERROR: visitFprod');
    return null;
  }


  visitFinputs(ctx: FinputsContext) {
    if (ctx.expr) {
      return new OutputsCall(
        this.visitExpression(ctx.expr),
        this.getLocation(ctx)
      )
    }

    return null;
  }


  visitFoutputs(ctx: FoutputsContext) {
    if (ctx.expr) {
      return new InputsCall(
        this.visitExpression(ctx.expr),
        this.getLocation(ctx)
      )
    }

    return null;
  }


  visitCaserule(ctx: CaseruleContext) {
    if (ctx.args && ctx.expr) {
      return new Pattern(
        this.visitArglist(ctx.args),
        this.visitExpression(ctx.expr),
        this.getLocation(ctx)
      )
    }

    return null;
  }


  visitIdent(ctx: IdentContext): Identifier {
    return new Identifier(ctx.getText(), this.getLocation(ctx));
  }

  // Visit a parse tree produced by FaustParser#uqstring.
  visitUqstring(ctx: UqstringContext): string {
    const string = ctx.getText();
    return string.slice(1, string.length - 1);
  }

  // Visit a parse tree produced by FaustParser#fstring.
  visitFstring(ctx: FstringContext): string | null {
    return ctx.str?.text || null;
  }

  // Visit a parse tree produced by FaustParser#vallist.
  visitVallist(ctx: VallistContext): (number | null)[] | null {

    if (ctx.list && ctx.n) {

      const rest = this.visitVallist(ctx.list);
      if (!rest) {
        console.log("ERROR: Can't parse vallist");
        return null;
      }

      return [...rest, this.visitNumber(ctx.n)];
    }

    if (ctx.n) {
      return [this.visitNumber(ctx.n)];
    }

    return null;
  }


  // Visit a parse tree produced by FaustParser#number.
  visitNumber(ctx: NumberContext): number | null {
    if (ctx.sign && ctx.n) {
      const sign = ctx.sign?.text || '';
      const value = parseFloat(`${sign}${ctx.n.text}`);

      return value;
    }

    if (ctx.n) {
      return parseFloat(ctx.n.text);
    }

    return null;
  }


  // Visit a parse tree produced by FaustParser#string.
  visitString(ctx: StringContext) {
    return ctx.STRING().text;
  }


  visitName(ctx: NameContext) {
    return ctx.IDENT().text;
  }


  visitType(ctx: TypeContext): string | null {
    return ctx?.intFloatType?.text || null;
  }


  visitSignature(ctx: SignatureContext) {
    if (ctx.fntype && ctx.fn && ctx.fntypelist) {
      const fnType = this.visitType(ctx.fntype);
      const fn = this.visitFun(ctx.fn);
      const fnTypelist = this.visitTypelist(ctx.fntypelist);

      return {
        fnType,
        fn,
        fnTypelist
      };
    }

    if (ctx.fntype && ctx.fn) {
      const fnType = this.visitType(ctx.fntype);
      const fn = this.visitFun(ctx.fn);

      return {
        fnType,
        fn
      };
    }

    console.log('ERROR: Visit visitSignature');

    return null;
  }

  visitFun(ctx: FunContext) {
    if (ctx.sp && ctx.dp && ctx.qp) {
      return `${ctx.sp.text},${ctx.dp.text},${ctx.dp.text}`; // TODO: return proper function identificators
    }

    if (ctx.sp && ctx.dp) {
      return `${ctx.sp.text},${ctx.dp.text}`; // TODO: return proper function identificators
    }

    if (ctx.sp) {
      return `${ctx.sp.text}`; // TODO: return proper function identificators
    }

    console.log('ERROR: Visit visitFun');
    return null;
  }

  // Visit a parse tree produced by FaustParser#typelist.
  visitTypelist(ctx: TypelistContext): (string | null)[] | null {
    if (ctx.fntypelist && ctx.fntype) {

      const typelist = this.visitTypelist(ctx.fntypelist);
      if (!typelist) {
        console.log('ERROR: Visit typelist');
        return null;
      }

      const type = this.visitType(ctx.fntype)

      if (!typelist) {
        console.log('ERROR: Visit typelist');
        return null;
      }

      return [...typelist, type];
    }

    if (ctx.fntype) {
      return [this.visitType(ctx.fntype)];
    }

    console.log('ERROR: Visit typelist');
    return null;
  }

  visitTerminal(ctx: any) {
    return EOF;
  }

  private visitChildren(ctx: any) {
    // @ts-ignore
    return super.visitChildren(ctx);
  }

  private getLocation(ctx: any): ILocation {
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
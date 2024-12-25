"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaustVisitor = void 0;
const FaustParserVisitor_js_1 = __importDefault(require("./generated/FaustParserVisitor.js"));
const FaustParser_js_1 = require("./generated/FaustParser.js");
const nodes_interface_js_1 = require("./ast/nodes.interface.js");
const EOF = "<EOF>";
class FaustVisitor extends FaustParserVisitor_js_1.default {
    constructor() {
        super();
    }
    // Visit a parse tree produced by FaustParser#program.
    visitProgram(ctx) {
        const body = this.visitChildren(ctx)
            .filter(s => s !== EOF);
        const location = this.getLocation(ctx);
        return new nodes_interface_js_1.Program(body, location);
    }
    // Visit a parse tree produced by FaustParser#variant.
    visitVariant(ctx) {
        if (ctx.precision) {
            return ctx.precision.text;
        }
        return null;
    }
    visitImportStatement(ctx) {
        const filename = this.visitUqstring(ctx.importName);
        return new nodes_interface_js_1.Import(filename, this.getLocation(ctx));
    }
    visitStatement(ctx) {
        if (ctx.def instanceof FaustParser_js_1.DefinitionContext) {
            return this.visitDefinition(ctx.def);
        }
        if (ctx.imp instanceof FaustParser_js_1.ImportStatementContext) {
            return this.visitImportStatement(ctx.imp);
        }
        if (ctx.decname instanceof FaustParser_js_1.NameContext
            && ctx.decval instanceof FaustParser_js_1.StringContext) {
            const name = this.visitName(ctx.decname);
            const fnName = ctx.decarg ?
                this.visitName(ctx.decarg)
                : null;
            const value = this.visitString(ctx.decval);
            return new nodes_interface_js_1.Declare(fnName, name, value, this.getLocation(ctx));
        }
        console.log("ERROR: Parsing statement");
        return null;
    }
    visitVariantstatement(ctx) {
        const precisions = ctx.variant().map((v) => this.visitVariant(v));
        const declaration = this.visitStatement(ctx.variantStatement);
        return new nodes_interface_js_1.PrecisionDeclaration(precisions, declaration, this.getLocation(ctx));
    }
    visitDefinition(ctx) {
        let args = ctx.args
            ? this.visitArglist(ctx.args)
            : null;
        if (args) {
            // Replacing Identifier with IdentifierDeclaration
            args = args.map(a => {
                if (a instanceof nodes_interface_js_1.Identifier) {
                    return new nodes_interface_js_1.IdentifierDeclaration(a.name, a.location);
                }
                return a;
            });
        }
        if (ctx.identname && ctx.expr) {
            const id = this.visitDefname(ctx.identname);
            const expression = this.visitExpression(ctx.expr);
            if (args && args.length) {
                return new nodes_interface_js_1.PatternDefinition(id, args, false, expression, this.getLocation(ctx));
            }
            return new nodes_interface_js_1.Definition(id, args, false, expression, this.getLocation(ctx));
        }
        console.log("ERROR Parsing Definition");
        return null;
    }
    visitDefname(ctx) {
        return this.visitIdent(ctx.ident(), true);
    }
    visitArglist(ctx) {
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
    visitReclist(ctx) {
        // Implemented
        return this.visitChildren(ctx);
    }
    visitRecinition(ctx) {
        if (ctx.identname && ctx.expr) {
            const id = this.visitRecname(ctx.identname);
            const expression = this.visitExpression(ctx.expr);
            return new nodes_interface_js_1.Definition(id, null, true, expression, this.getLocation(ctx));
        }
        console.log("Error: Recinition. Return null");
        return null;
    }
    visitRecname(ctx) {
        return this.visitIdent(ctx.identname);
    }
    // Visit a parse tree produced by FaustParser#deflist.
    visitDeflist(ctx) {
        if (ctx.def) {
            const precisions = ctx.variant().map((v) => this.visitVariant(v));
            const declaration = this.visitDefinition(ctx.def);
            if (precisions.length) {
                return new nodes_interface_js_1.PrecisionDeclaration(precisions, declaration, this.getLocation(ctx));
            }
            return declaration;
        }
        if (ctx.def) {
            return this.visitDefinition(ctx.def);
        }
        console.log('ERROR parse deflist');
        return null;
    }
    visitArgument(ctx) {
        if (ctx.op && ctx.left && ctx.right) {
            const operator = ctx.op.text;
            const left = this.visitArgument(ctx.left);
            const right = this.visitArgument(ctx.right);
            return new nodes_interface_js_1.CompositionExpression(operator, left, right, this.getLocation(ctx));
        }
        if (ctx.expr) {
            return this.visitInfixexpr(ctx.expr);
        }
        console.log("ARGUMENT ERROR: returning stub node");
        return null;
    }
    visitParams(ctx) {
        if (ctx.id && ctx.pars) {
            const params = this.visitParams(ctx.pars);
            if (!params) {
                console.log("ERROR: Visit lambda params");
                return null;
            }
            return [...params, this.visitIdent(ctx.id)];
        }
        if (ctx.id) {
            return [this.visitIdent(ctx.id, true)];
        }
        console.log("ERROR: Visit lambda params");
        return null;
    }
    // Visit a parse tree produced by FaustParser#expression.
    visitExpression(ctx) {
        if (ctx.infexpr) {
            return this.visitInfixexpr(ctx.infexpr);
        }
        if (ctx.expr && ctx.op.text === 'with') {
            const expression = this.visitExpression(ctx.expr);
            const context = ctx.defs.getChildCount() === 0
                ? []
                : this.visitWithdef(ctx.defs);
            return new nodes_interface_js_1.WithExpression(expression, context, this.getLocation(ctx));
        }
        if (ctx.expr && ctx.op.text === 'letrec') {
            const expression = this.visitExpression(ctx.expr);
            const context = ctx.recs.getChildCount() === 0
                ? []
                : this.visitReclist(ctx.recs);
            return new nodes_interface_js_1.LetrecExpression(expression, context, this.getLocation(ctx));
        }
        if (ctx.left && ctx.op && ctx.right) {
            const operator = ctx.op.text;
            const left = this.visitExpression(ctx.left);
            const right = this.visitExpression(ctx.right);
            return new nodes_interface_js_1.CompositionExpression(operator, left, right, this.getLocation(ctx));
        }
        console.log("EXPRESSION ERROR, returning stub");
        return null;
    }
    visitWithdef(ctx) {
        // implemented
        // Valid, since withdef is an alias for (definition | variantdefinition)*
        return this.visitChildren(ctx);
    }
    visitInfixexpr(ctx) {
        if (ctx.left && ctx.definitions) {
            const expr = this.visitInfixexpr(ctx.left);
            const definitions = ctx.deflist()
                .map((definition) => this.visitDeflist(definition));
            return new nodes_interface_js_1.ExplicitSubstitution(definitions, expr, this.getLocation(ctx));
        }
        if (ctx.op && ctx.expr) {
            const operator = ctx.op.text;
            if (operator === "'") {
                return new nodes_interface_js_1.PostfixDelayExpression(this.visitInfixexpr(ctx.expr), this.getLocation(ctx));
            }
            console.log('ERROR: Unrecognized postfix expression');
            return null;
        }
        if (ctx.op && ctx.left && ctx.right) {
            const operator = ctx.op.text;
            const left = this.visitInfixexpr(ctx.left);
            const right = this.visitInfixexpr(ctx.right);
            return new nodes_interface_js_1.BinaryExpression(operator, left, right, this.getLocation(ctx));
        }
        if (ctx.prim) {
            return this.visitPrimitive(ctx.prim);
        }
        if (ctx.callee && ctx.arguments) {
            const args = ctx.arguments
                ? this.visitArglist(ctx.arguments)
                : null;
            const callee = this.visitInfixexpr(ctx.callee);
            return new nodes_interface_js_1.ApplicationExpression(args, callee, this.getLocation(ctx));
        }
        if (ctx.left && ctx.identificator) {
            return new nodes_interface_js_1.AccessExpression(this.visitInfixexpr(ctx.left), this.visitIdent(ctx.identificator), this.getLocation(ctx));
        }
        console.log("INFIX EXPRESSION ERROR");
        return null;
    }
    visitPrimitive(ctx) {
        if (ctx.value) {
            const sign = ctx.sign?.text || '';
            const value = parseFloat(`${sign}${ctx.value.text}`);
            return new nodes_interface_js_1.NumberPrimitive(value, this.getLocation(ctx));
        }
        if (ctx.wire) {
            return new nodes_interface_js_1.WirePrimitive(this.getLocation(ctx));
        }
        if (ctx.cut) {
            return new nodes_interface_js_1.CutPrimitive(this.getLocation(ctx));
        }
        if (ctx.primitivetype) {
            const primitivetype = ctx.primitivetype.text;
            return new nodes_interface_js_1.BroadPrimitive(primitivetype, this.getLocation(ctx));
        }
        if (ctx.primitiveident) {
            const identificator = this.visitIdent(ctx.primitiveident);
            if (ctx.sign) {
                return new nodes_interface_js_1.UnaryExpression("-", identificator, this.getLocation(ctx));
            }
            return identificator;
        }
        const firstChild = ctx.getChild(0);
        if (firstChild instanceof FaustParser_js_1.ButtonContext) {
            return this.visitButton(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.CheckboxContext) {
            return this.visitCheckbox(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.NentryContext) {
            return this.visitNentry(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.VsliderContext) {
            return this.visitVslider(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.HsliderContext) {
            return this.visitHslider(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.VgroupContext) {
            return this.visitVgroup(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.HgroupContext) {
            return this.visitHgroup(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.TgroupContext) {
            return this.visitTgroup(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.VbargraphContext) {
            return this.visitVbargraph(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.HbargraphContext) {
            return this.visitHbargraph(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.FsumContext) {
            return this.visitFsum(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.FseqContext) {
            return this.visitFseq(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.FparContext) {
            return this.visitFpar(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.FprodContext) {
            return this.visitFprod(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.FinputsContext) {
            return this.visitFinputs(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.FoutputsContext) {
            return this.visitFoutputs(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.FfunctionContext) {
            return this.visitFfunction(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.FconstContext) {
            return this.visitFconst(firstChild);
        }
        if (firstChild instanceof FaustParser_js_1.FvariableContext) {
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
            return new nodes_interface_js_1.LambdaExpression(params, this.visitExpression(ctx.expr), this.getLocation(ctx));
        }
        if (ctx.source) {
            if (ctx.component) {
                return new nodes_interface_js_1.Component(this.visitUqstring(ctx.source), this.getLocation(ctx));
            }
            if (ctx.library) {
                return new nodes_interface_js_1.Library(this.visitUqstring(ctx.source), this.getLocation(ctx));
            }
            console.log('ERROR: parsing component or library');
            return null;
        }
        if (ctx.waveform && ctx.values) {
            return new nodes_interface_js_1.Waveform(this.visitVallist(ctx.values), this.getLocation(ctx));
        }
        if (ctx.route && ctx.ins && ctx.outs && ctx.pairs) {
            return new nodes_interface_js_1.Route(this.visitArgument(ctx.ins), this.visitArgument(ctx.outs), this.visitExpression(ctx.pairs), this.getLocation(ctx));
        }
        if (ctx.environment) {
            const environmentBody = this.visitChildren(ctx)
                .filter(s => s !== EOF);
            return new nodes_interface_js_1.Environment(environmentBody, this.getLocation(ctx));
        }
        if (ctx.patterns) {
            const patterns = ctx.caserule().map((p) => this.visitCaserule(p));
            return new nodes_interface_js_1.PatternMatching(patterns, this.getLocation(ctx));
        }
        console.log("ERROR: primitive not found, returning null");
        return null;
    }
    visitFfunction(ctx) {
        if (ctx.sign && ctx.header && ctx.str) {
            const signature = this.visitSignature(ctx.sign);
            const header = this.visitFstring(ctx.header);
            const str = this.visitString(ctx.str);
            return new nodes_interface_js_1.ForeignFunction(signature?.fnType || null, signature?.fn || null, signature?.fnTypelist || null, header, str, this.getLocation(ctx));
        }
        console.log('ERROR: Parse ffunction');
        return null;
    }
    visitFconst(ctx) {
        if (ctx.ctype && ctx.cname && ctx.cstring) {
            return new nodes_interface_js_1.ForeignConstant(this.visitType(ctx.ctype), this.visitName(ctx.cname), this.visitFstring(ctx.cstring), this.getLocation(ctx));
        }
        console.log('ERROR: parse fconst');
        return null;
    }
    visitFvariable(ctx) {
        if (ctx.vtype && ctx.vname && ctx.vstring) {
            return new nodes_interface_js_1.ForeignVariable(this.visitType(ctx.vtype), this.visitName(ctx.vname), this.visitFstring(ctx.vstring), this.getLocation(ctx));
        }
        console.log('ERROR: parse fvariable');
        return this.visitChildren(ctx);
    }
    visitButton(ctx) {
        if (ctx.caption) {
            const label = this.visitUqstring(ctx.caption);
            return new nodes_interface_js_1.ButtonControl(label, this.getLocation(ctx));
        }
        console.log('ERROR: Parse button failed');
        return null;
    }
    // Visit a parse tree produced by FaustParser#checkbox.
    visitCheckbox(ctx) {
        if (ctx.caption) {
            const label = this.visitUqstring(ctx.caption);
            return new nodes_interface_js_1.CheckboxControl(label, this.getLocation(ctx));
        }
        console.log('ERROR: Parse checkbox failed');
        return null;
    }
    visitVslider(ctx) {
        if (ctx.caption && ctx.initial && ctx.min && ctx.max && ctx.step) {
            return new nodes_interface_js_1.VsliderControl(this.visitUqstring(ctx.caption), this.visitArgument(ctx.initial), this.visitArgument(ctx.min), this.visitArgument(ctx.max), this.visitArgument(ctx.step), this.getLocation(ctx));
        }
        console.log('ERROR: Parse Vslider failed');
        return null;
    }
    // Visit a parse tree produced by FaustParser#hslider.
    visitHslider(ctx) {
        if (ctx.caption && ctx.initial && ctx.min && ctx.max && ctx.step) {
            return new nodes_interface_js_1.HsliderControl(this.visitUqstring(ctx.caption), this.visitArgument(ctx.initial), this.visitArgument(ctx.min), this.visitArgument(ctx.max), this.visitArgument(ctx.step), this.getLocation(ctx));
        }
        console.log('ERROR: Parse Vslider failed');
        return null;
    }
    // Visit a parse tree produced by FaustParser#nentry.
    visitNentry(ctx) {
        if (ctx.caption && ctx.initial && ctx.min && ctx.max && ctx.step) {
            return new nodes_interface_js_1.NentryControl(this.visitUqstring(ctx.caption), this.visitArgument(ctx.initial), this.visitArgument(ctx.min), this.visitArgument(ctx.max), this.visitArgument(ctx.step), this.getLocation(ctx));
        }
        console.log('ERROR: Parse Vslider failed');
        return null;
    }
    // Visit a parse tree produced by FaustParser#vgroup.
    visitVgroup(ctx) {
        if (ctx.caption && ctx.expr) {
            return new nodes_interface_js_1.VGroupControl(this.visitUqstring(ctx.caption), this.visitExpression(ctx.expr), this.getLocation(ctx));
        }
        console.log('ERROR: Building AST for vgroup');
        return null;
    }
    // Visit a parse tree produced by FaustParser#hgroup.
    visitHgroup(ctx) {
        if (ctx.caption && ctx.expr) {
            return new nodes_interface_js_1.HGroupControl(this.visitUqstring(ctx.caption), this.visitExpression(ctx.expr), this.getLocation(ctx));
        }
        console.log('ERROR: Building AST for hgroup');
        return null;
    }
    // Visit a parse tree produced by FaustParser#tgroup.
    visitTgroup(ctx) {
        if (ctx.caption && ctx.expr) {
            return new nodes_interface_js_1.TGroupControl(this.visitUqstring(ctx.caption), this.visitExpression(ctx.expr), this.getLocation(ctx));
        }
        console.log('ERROR: Building AST for tgroup');
        return null;
    }
    visitVbargraph(ctx) {
        if (ctx.caption && ctx.min && ctx.max) {
            return new nodes_interface_js_1.VbargraphControl(this.visitUqstring(ctx.caption), this.visitArgument(ctx.min), this.visitArgument(ctx.max), this.getLocation(ctx));
        }
        console.log('ERROR parsing vbargraph');
        return null;
    }
    visitHbargraph(ctx) {
        if (ctx.caption && ctx.min && ctx.max) {
            return new nodes_interface_js_1.HbargraphControl(this.visitUqstring(ctx.caption), this.visitArgument(ctx.min), this.visitArgument(ctx.max), this.getLocation(ctx));
        }
        console.log('ERROR parsing hbargraph');
        return null;
    }
    visitSoundfile(ctx) {
        if (ctx.caption && ctx.outs) {
            return new nodes_interface_js_1.Soundfile(this.visitUqstring(ctx.caption), this.visitArgument(ctx.outs), this.getLocation(ctx));
        }
        console.log("ERROR: Parsing soundfile");
        return null;
    }
    // Visit a parse tree produced by FaustParser#fpar.
    visitFpar(ctx) {
        if (ctx.id && ctx.arg && ctx.expr) {
            return new nodes_interface_js_1.ParIteration(this.visitIdent(ctx.id), this.visitArgument(ctx.arg), this.visitExpression(ctx.expr), this.getLocation(ctx));
        }
        console.log('ERROR: visitFpar');
        return null;
    }
    // Visit a parse tree produced by FaustParser#fseq.
    visitFseq(ctx) {
        if (ctx.id && ctx.arg && ctx.expr) {
            return new nodes_interface_js_1.SeqIteration(this.visitIdent(ctx.id), this.visitArgument(ctx.arg), this.visitExpression(ctx.expr), this.getLocation(ctx));
        }
        console.log('ERROR: visitFseq');
        return null;
    }
    visitFsum(ctx) {
        if (ctx.id && ctx.arg && ctx.expr) {
            return new nodes_interface_js_1.SumIteration(this.visitIdent(ctx.id), this.visitArgument(ctx.arg), this.visitExpression(ctx.expr), this.getLocation(ctx));
        }
        console.log('ERROR: visitFsum');
        return null;
    }
    visitFprod(ctx) {
        if (ctx.id && ctx.arg && ctx.expr) {
            return new nodes_interface_js_1.ProdIteration(this.visitIdent(ctx.id), this.visitArgument(ctx.arg), this.visitExpression(ctx.expr), this.getLocation(ctx));
        }
        console.log('ERROR: visitFprod');
        return null;
    }
    visitFinputs(ctx) {
        if (ctx.expr) {
            return new nodes_interface_js_1.OutputsCall(this.visitExpression(ctx.expr), this.getLocation(ctx));
        }
        return null;
    }
    visitFoutputs(ctx) {
        if (ctx.expr) {
            return new nodes_interface_js_1.InputsCall(this.visitExpression(ctx.expr), this.getLocation(ctx));
        }
        return null;
    }
    visitCaserule(ctx) {
        if (ctx.args && ctx.expr) {
            return new nodes_interface_js_1.Pattern(this.visitArglist(ctx.args), this.visitExpression(ctx.expr), this.getLocation(ctx));
        }
        return null;
    }
    visitIdent(ctx, isDeclaration = false) {
        if (isDeclaration) {
            return new nodes_interface_js_1.IdentifierDeclaration(ctx.getText(), this.getLocation(ctx));
        }
        return new nodes_interface_js_1.Identifier(ctx.getText(), this.getLocation(ctx));
    }
    // Visit a parse tree produced by FaustParser#uqstring.
    visitUqstring(ctx) {
        const string = ctx.getText();
        return string.slice(1, string.length - 1);
    }
    // Visit a parse tree produced by FaustParser#fstring.
    visitFstring(ctx) {
        return ctx.str?.text || null;
    }
    // Visit a parse tree produced by FaustParser#vallist.
    visitVallist(ctx) {
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
    visitNumber(ctx) {
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
    visitString(ctx) {
        return ctx.s.text;
    }
    visitName(ctx) {
        return ctx.n.text;
    }
    visitType(ctx) {
        return ctx?.intFloatType?.text || null;
    }
    visitSignature(ctx) {
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
    visitFun(ctx) {
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
    visitTypelist(ctx) {
        if (ctx.fntypelist && ctx.fntype) {
            const typelist = this.visitTypelist(ctx.fntypelist);
            if (!typelist) {
                console.log('ERROR: Visit typelist');
                return null;
            }
            const type = this.visitType(ctx.fntype);
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
    visitTerminal(ctx) {
        return EOF;
    }
    visitChildren(ctx) {
        // @ts-ignore
        return super.visitChildren(ctx);
    }
    getLocation(ctx) {
        return {
            start: {
                line: ctx.start.line,
                column: ctx.start.column
            },
            end: {
                line: ctx.stop?.line,
                column: ctx.stop?.column
            },
            range: [ctx.start.start, ctx.stop.start]
        };
    }
}
exports.FaustVisitor = FaustVisitor;

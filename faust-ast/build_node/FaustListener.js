"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaustListener = void 0;
const FaustParserListener_js_1 = __importDefault(require("./generated/FaustParserListener.js"));
class FaustListener extends FaustParserListener_js_1.default {
    constructor(AST, symbols, actions) {
        super();
        this.AST = AST;
        this.actions = actions;
        this.symbols = symbols;
    }
    // Enter a parse tree produced by FaustParser#statementlist.
    enterStatementlist(ctx) {
    }
    // Exit a parse tree produced by FaustParser#statementlist.
    exitStatementlist(ctx) {
    }
    // Enter a parse tree produced by FaustParser#program.
    enterProgram(ctx) {
        ctx.something = ctx.something || 0;
        ctx.something++;
        console.log(ctx.something, Object.keys(ctx));
    }
    // Exit a parse tree produced by FaustParser#program.
    exitProgram(ctx) {
        console.log('exit');
    }
    // Enter a parse tree produced by FaustParser#variantlist.
    enterVariantlist(ctx) {
    }
    // Exit a parse tree produced by FaustParser#variantlist.
    exitVariantlist(ctx) {
    }
    // Enter a parse tree produced by FaustParser#variant.
    enterVariant(ctx) {
    }
    // Exit a parse tree produced by FaustParser#variant.
    exitVariant(ctx) {
    }
    // Enter a parse tree produced by FaustParser#importStatement.
    enterImportStatement(ctx) {
    }
    // Exit a parse tree produced by FaustParser#importStatement.
    exitImportStatement(ctx) {
    }
    // Enter a parse tree produced by FaustParser#statement.
    enterStatement(ctx) {
    }
    // Exit a parse tree produced by FaustParser#statement.
    exitStatement(ctx) {
    }
    // Enter a parse tree produced by FaustParser#definition.
    enterDefinition(ctx) {
        // this.symbols.definitions.push(ctx.getChild(0).getText());
    }
    // Exit a parse tree produced by FaustParser#definition.
    exitDefinition(ctx) {
    }
    // Enter a parse tree produced by FaustParser#defname.
    enterDefname(ctx) {
    }
    // Exit a parse tree produced by FaustParser#defname.
    exitDefname(ctx) {
    }
    // Enter a parse tree produced by FaustParser#arglist.
    enterArglist(ctx) {
    }
    // Exit a parse tree produced by FaustParser#arglist.
    exitArglist(ctx) {
    }
    // Enter a parse tree produced by FaustParser#reclist.
    enterReclist(ctx) {
    }
    // Exit a parse tree produced by FaustParser#reclist.
    exitReclist(ctx) {
    }
    // Enter a parse tree produced by FaustParser#recinition.
    enterRecinition(ctx) {
    }
    // Exit a parse tree produced by FaustParser#recinition.
    exitRecinition(ctx) {
    }
    // Enter a parse tree produced by FaustParser#recname.
    enterRecname(ctx) {
    }
    // Exit a parse tree produced by FaustParser#recname.
    exitRecname(ctx) {
    }
    // Enter a parse tree produced by FaustParser#deflist.
    enterDeflist(ctx) {
    }
    // Exit a parse tree produced by FaustParser#deflist.
    exitDeflist(ctx) {
    }
    // Enter a parse tree produced by FaustParser#argument.
    enterArgument(ctx) {
    }
    // Exit a parse tree produced by FaustParser#argument.
    exitArgument(ctx) {
    }
    // Enter a parse tree produced by FaustParser#params.
    enterParams(ctx) {
    }
    // Exit a parse tree produced by FaustParser#params.
    exitParams(ctx) {
    }
    // Enter a parse tree produced by FaustParser#expression.
    enterExpression(ctx) {
    }
    // Exit a parse tree produced by FaustParser#expression.
    exitExpression(ctx) {
    }
    // Enter a parse tree produced by FaustParser#infixexpr.
    enterInfixexpr(ctx) {
    }
    // Exit a parse tree produced by FaustParser#infixexpr.
    exitInfixexpr(ctx) {
    }
    // Enter a parse tree produced by FaustParser#primitive.
    enterPrimitive(ctx) {
    }
    // Exit a parse tree produced by FaustParser#primitive.
    exitPrimitive(ctx) {
    }
    // Enter a parse tree produced by FaustParser#ffunction.
    enterFfunction(ctx) {
    }
    // Exit a parse tree produced by FaustParser#ffunction.
    exitFfunction(ctx) {
    }
    // Enter a parse tree produced by FaustParser#fconst.
    enterFconst(ctx) {
    }
    // Exit a parse tree produced by FaustParser#fconst.
    exitFconst(ctx) {
    }
    // Enter a parse tree produced by FaustParser#fvariable.
    enterFvariable(ctx) {
    }
    // Exit a parse tree produced by FaustParser#fvariable.
    exitFvariable(ctx) {
    }
    // Enter a parse tree produced by FaustParser#button.
    enterButton(ctx) {
    }
    // Exit a parse tree produced by FaustParser#button.
    exitButton(ctx) {
    }
    // Enter a parse tree produced by FaustParser#checkbox.
    enterCheckbox(ctx) {
    }
    // Exit a parse tree produced by FaustParser#checkbox.
    exitCheckbox(ctx) {
    }
    // Enter a parse tree produced by FaustParser#vslider.
    enterVslider(ctx) {
    }
    // Exit a parse tree produced by FaustParser#vslider.
    exitVslider(ctx) {
    }
    // Enter a parse tree produced by FaustParser#hslider.
    enterHslider(ctx) {
    }
    // Exit a parse tree produced by FaustParser#hslider.
    exitHslider(ctx) {
    }
    // Enter a parse tree produced by FaustParser#nentry.
    enterNentry(ctx) {
    }
    // Exit a parse tree produced by FaustParser#nentry.
    exitNentry(ctx) {
    }
    // Enter a parse tree produced by FaustParser#vgroup.
    enterVgroup(ctx) {
    }
    // Exit a parse tree produced by FaustParser#vgroup.
    exitVgroup(ctx) {
    }
    // Enter a parse tree produced by FaustParser#hgroup.
    enterHgroup(ctx) {
    }
    // Exit a parse tree produced by FaustParser#hgroup.
    exitHgroup(ctx) {
    }
    // Enter a parse tree produced by FaustParser#tgroup.
    enterTgroup(ctx) {
    }
    // Exit a parse tree produced by FaustParser#tgroup.
    exitTgroup(ctx) {
    }
    // Enter a parse tree produced by FaustParser#vbargraph.
    enterVbargraph(ctx) {
    }
    // Exit a parse tree produced by FaustParser#vbargraph.
    exitVbargraph(ctx) {
    }
    // Enter a parse tree produced by FaustParser#hbargraph.
    enterHbargraph(ctx) {
    }
    // Exit a parse tree produced by FaustParser#hbargraph.
    exitHbargraph(ctx) {
    }
    // Enter a parse tree produced by FaustParser#soundfile.
    enterSoundfile(ctx) {
    }
    // Exit a parse tree produced by FaustParser#soundfile.
    exitSoundfile(ctx) {
    }
    // Enter a parse tree produced by FaustParser#fpar.
    enterFpar(ctx) {
    }
    // Exit a parse tree produced by FaustParser#fpar.
    exitFpar(ctx) {
    }
    // Enter a parse tree produced by FaustParser#fseq.
    enterFseq(ctx) {
    }
    // Exit a parse tree produced by FaustParser#fseq.
    exitFseq(ctx) {
    }
    // Enter a parse tree produced by FaustParser#fsum.
    enterFsum(ctx) {
    }
    // Exit a parse tree produced by FaustParser#fsum.
    exitFsum(ctx) {
    }
    // Enter a parse tree produced by FaustParser#fprod.
    enterFprod(ctx) {
    }
    // Exit a parse tree produced by FaustParser#fprod.
    exitFprod(ctx) {
    }
    // Enter a parse tree produced by FaustParser#finputs.
    enterFinputs(ctx) {
    }
    // Exit a parse tree produced by FaustParser#finputs.
    exitFinputs(ctx) {
    }
    // Enter a parse tree produced by FaustParser#foutputs.
    enterFoutputs(ctx) {
    }
    // Exit a parse tree produced by FaustParser#foutputs.
    exitFoutputs(ctx) {
    }
    // Enter a parse tree produced by FaustParser#caserulelist.
    enterCaserulelist(ctx) {
    }
    // Exit a parse tree produced by FaustParser#caserulelist.
    exitCaserulelist(ctx) {
    }
    // Enter a parse tree produced by FaustParser#caserule.
    enterCaserule(ctx) {
    }
    // Exit a parse tree produced by FaustParser#caserule.
    exitCaserule(ctx) {
    }
    // Enter a parse tree produced by FaustParser#ident.
    enterIdent(ctx) {
    }
    // Exit a parse tree produced by FaustParser#ident.
    exitIdent(ctx) {
    }
    // Enter a parse tree produced by FaustParser#uqstring.
    enterUqstring(ctx) {
    }
    // Exit a parse tree produced by FaustParser#uqstring.
    exitUqstring(ctx) {
    }
    // Enter a parse tree produced by FaustParser#fstring.
    enterFstring(ctx) {
    }
    // Exit a parse tree produced by FaustParser#fstring.
    exitFstring(ctx) {
    }
    // Enter a parse tree produced by FaustParser#vallist.
    enterVallist(ctx) {
    }
    // Exit a parse tree produced by FaustParser#vallist.
    exitVallist(ctx) {
    }
    // Enter a parse tree produced by FaustParser#number.
    enterNumber(ctx) {
    }
    // Exit a parse tree produced by FaustParser#number.
    exitNumber(ctx) {
    }
    // Enter a parse tree produced by FaustParser#string.
    enterString(ctx) {
    }
    // Exit a parse tree produced by FaustParser#string.
    exitString(ctx) {
    }
    // Enter a parse tree produced by FaustParser#name.
    enterName(ctx) {
    }
    // Exit a parse tree produced by FaustParser#name.
    exitName(ctx) {
    }
    // Enter a parse tree produced by FaustParser#type.
    enterType(ctx) {
    }
    // Exit a parse tree produced by FaustParser#type.
    exitType(ctx) {
    }
    // Enter a parse tree produced by FaustParser#signature.
    enterSignature(ctx) {
    }
    // Exit a parse tree produced by FaustParser#signature.
    exitSignature(ctx) {
    }
    // Enter a parse tree produced by FaustParser#fun.
    enterFun(ctx) {
    }
    // Exit a parse tree produced by FaustParser#fun.
    exitFun(ctx) {
    }
    // Enter a parse tree produced by FaustParser#singleprecisionfun.
    enterSingleprecisionfun(ctx) {
    }
    // Exit a parse tree produced by FaustParser#singleprecisionfun.
    exitSingleprecisionfun(ctx) {
    }
    // Enter a parse tree produced by FaustParser#doubleprecisionfun.
    enterDoubleprecisionfun(ctx) {
    }
    // Exit a parse tree produced by FaustParser#doubleprecisionfun.
    exitDoubleprecisionfun(ctx) {
    }
    // Enter a parse tree produced by FaustParser#quadprecisionfun.
    enterQuadprecisionfun(ctx) {
    }
    // Exit a parse tree produced by FaustParser#quadprecisionfun.
    exitQuadprecisionfun(ctx) {
    }
    // Enter a parse tree produced by FaustParser#typelist.
    enterTypelist(ctx) {
    }
    // Exit a parse tree produced by FaustParser#typelist.
    exitTypelist(ctx) {
    }
    visitTerminal() { }
    visitErrorNode() { }
    enterEveryRule() { }
    exitEveryRule() { }
}
exports.FaustListener = FaustListener;

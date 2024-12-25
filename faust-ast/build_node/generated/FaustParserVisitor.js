"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Generated from FaustParser.g4 by ANTLR 4.9.2
// jshint ignore: start
const antlr4_1 = __importDefault(require("antlr4"));
// This class defines a complete generic visitor for a parse tree produced by FaustParser.
class FaustParserVisitor extends antlr4_1.default.tree.ParseTreeVisitor {
    // Visit a parse tree produced by FaustParser#variantstatement.
    visitVariantstatement(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#program.
    visitProgram(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#variant.
    visitVariant(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#importStatement.
    visitImportStatement(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#statement.
    visitStatement(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#definition.
    visitDefinition(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#defname.
    visitDefname(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#arglist.
    visitArglist(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#reclist.
    visitReclist(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#recinition.
    visitRecinition(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#recname.
    visitRecname(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#deflist.
    visitDeflist(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#argument.
    visitArgument(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#params.
    visitParams(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#withdef.
    visitWithdef(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#expression.
    visitExpression(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#infixexpr.
    visitInfixexpr(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#primitive.
    visitPrimitive(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#ffunction.
    visitFfunction(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#fconst.
    visitFconst(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#fvariable.
    visitFvariable(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#button.
    visitButton(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#checkbox.
    visitCheckbox(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#vslider.
    visitVslider(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#hslider.
    visitHslider(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#nentry.
    visitNentry(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#vgroup.
    visitVgroup(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#hgroup.
    visitHgroup(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#tgroup.
    visitTgroup(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#vbargraph.
    visitVbargraph(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#hbargraph.
    visitHbargraph(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#soundfile.
    visitSoundfile(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#fpar.
    visitFpar(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#fseq.
    visitFseq(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#fsum.
    visitFsum(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#fprod.
    visitFprod(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#finputs.
    visitFinputs(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#foutputs.
    visitFoutputs(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#caserule.
    visitCaserule(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#ident.
    visitIdent(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#uqstring.
    visitUqstring(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#fstring.
    visitFstring(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#vallist.
    visitVallist(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#number.
    visitNumber(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#string.
    visitString(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#name.
    visitName(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#type.
    visitType(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#signature.
    visitSignature(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#fun.
    visitFun(ctx) {
        return this.visitChildren(ctx);
    }
    // Visit a parse tree produced by FaustParser#typelist.
    visitTypelist(ctx) {
        return this.visitChildren(ctx);
    }
}
exports.default = FaustParserVisitor;

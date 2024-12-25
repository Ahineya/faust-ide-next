"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const antlr4_1 = __importDefault(require("antlr4"));
const FaustLexer_js_1 = __importDefault(require("./generated/FaustLexer.js"));
const FaustParser_js_1 = __importDefault(require("./generated/FaustParser.js"));
const FaustErrorListener_js_1 = require("./FaustErrorListener.js");
const FaustVisitor_js_1 = require("./FaustVisitor.js");
const FaustErrorStrategy_js_1 = require("./FaustErrorStrategy.js");
const nodes_interface_js_1 = require("./ast/nodes.interface.js");
const { CommonTokenStream, InputStream } = antlr4_1.default;
const getCommentLocation = (t) => {
    return {
        start: {
            line: t.start?.line,
            column: t.start?.column
        },
        end: {
            line: t.stop?.line,
            column: t.stop?.column
        },
        range: [t.start, t.stop]
    };
};
const parse = (input, debug = false) => {
    const chars = new InputStream(input, true);
    const lexer = new FaustLexer_js_1.default(chars);
    const tokens = new CommonTokenStream(lexer);
    tokens.fill();
    console.log(tokens);
    const comments = tokens.tokens.filter(t => [FaustLexer_js_1.default.COMMENT, FaustLexer_js_1.default.LINE_COMMENT].includes(t.type))
        .map(t => {
        if (t.type === FaustLexer_js_1.default.COMMENT) {
            return new nodes_interface_js_1.CommentBlock(t.text, getCommentLocation(t));
        }
        else {
            return new nodes_interface_js_1.CommentLine(t.text, getCommentLocation(t));
        }
    });
    const parser = new FaustParser_js_1.default(tokens);
    //@ts-ignore
    parser._errHandler = new FaustErrorStrategy_js_1.FaustErrorStrategy();
    parser.buildParseTrees = true;
    // TODO: Add errors gathering here
    if (!debug) {
        parser.removeErrorListeners();
    }
    const parseErrors = [];
    parser.addErrorListener(new FaustErrorListener_js_1.FaustErrorListener(parseErrors));
    const tree = parser.program();
    const faustVisitor = new FaustVisitor_js_1.FaustVisitor();
    const AST = faustVisitor.visitProgram(tree);
    AST.comments = comments;
    return {
        AST,
        errors: parseErrors
    };
};
exports.parse = parse;

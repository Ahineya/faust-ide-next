"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaustErrorListener = void 0;
const antlr4_1 = __importDefault(require("antlr4"));
const FaustLexer_js_1 = __importDefault(require("./generated/FaustLexer.js"));
const Errors_js_1 = __importDefault(require("antlr4/src/antlr4/error/Errors.js"));
const IntervalSet_js_1 = __importDefault(require("antlr4/src/antlr4/IntervalSet.js"));
class FaustErrorListener extends antlr4_1.default.error.ErrorListener {
    constructor(parseErrors) {
        super();
        this.parseErrors = [];
        this.parseErrors = parseErrors;
    }
    syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
        let error;
        const tokens = recognizer.getTokenStream();
        let input;
        switch (true) {
            case e instanceof Errors_js_1.default.NoViableAltException:
                const currentRuleName = recognizer.ruleNames[recognizer._ctx.ruleIndex];
                input = this.getInput(tokens, e);
                error = `[${line}:${column}:${input}] Syntax Error: expecting ${currentRuleName}, but got "${input}"`;
                break;
            case e instanceof Errors_js_1.default.InputMismatchException:
                input = this.getInput(tokens, e);
                if (offendingSymbol.type === FaustLexer_js_1.default.UNTERMINATED_STRING) {
                    error = `[${line}:${column}:${input}] Syntax Error: Unterminated string "${input}"`;
                }
                else if (offendingSymbol.type === FaustLexer_js_1.default.ErrorChar) {
                    error = `[${line}:${column}:${input}] Syntax Error: Unrecognized symbol "${input}"`;
                }
                else {
                    const expected = recognizer.getExpectedTokens().toString(recognizer.literalNames, recognizer.symbolicNames);
                    error = `[${line}:${column}:${input}:${expected}] Syntax Error: Expecting ${expected} but got "${input}"`;
                }
                break;
            default:
                if (msg.includes('extraneous input')) {
                    error = `[${line}:${column}:${offendingSymbol.text}] Syntax Error: Unexpected token ${offendingSymbol.text}`;
                }
                else {
                    error = `[${line}:${column}:${offendingSymbol.text}] Syntax Error: ${msg}`;
                }
                break;
        }
        this.parseErrors.push(error);
    }
    getInput(tokens, e) {
        let input;
        if (tokens !== null) {
            if (e.startToken && e.startToken.type === FaustLexer_js_1.default.EOF) {
                input = "<EOF>";
            }
            else {
                input = tokens.getText(new IntervalSet_js_1.default.Interval((e.startToken || e.offendingToken).tokenIndex, e.offendingToken.tokenIndex));
            }
        }
        else {
            input = "<unknown input>";
        }
        return input;
    }
    reportAmbiguity(recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs) {
        console.log('Ambiguity');
    }
    reportAttemptingFullContext(recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs) {
        console.log('AttemptingFullContext');
    }
    reportContextSensitivity(recognizer, dfa, startIndex, stopIndex, prediction, configs) {
        console.log('ContextSensitivity');
    }
}
exports.FaustErrorListener = FaustErrorListener;

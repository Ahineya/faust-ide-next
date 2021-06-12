import antlr4 from "antlr4";
import FaustLexer from "./generated/FaustLexer.js";
import errors from "antlr4/src/antlr4/error/Errors.js";
import interval from "antlr4/src/antlr4/IntervalSet.js";

export class FaustErrorListener extends antlr4.error.ErrorListener {

  parseErrors = [];

  constructor(parseErrors) {
    super();
    this.parseErrors = parseErrors;
  }

  syntaxError(recognizer, offendingSymbol, line, column, msg, e) {

    let error;

    const tokens = recognizer.getTokenStream();
    let input;

    switch (true) {
      case e instanceof errors.NoViableAltException:
        const currentRuleName = recognizer.ruleNames[recognizer._ctx.ruleIndex];

        input = this.getInput(tokens, e);
        error = `[${line}:${column}:${input}] Syntax Error: expecting ${currentRuleName}, but got "${input}"`;
        break;
      case e instanceof errors.InputMismatchException:
        input = this.getInput(tokens, e);

        if (offendingSymbol.type === FaustLexer.UNTERMINATED_STRING) {
          error = `[${line}:${column}:${input}] Syntax Error: Unterminated string "${input}"`;
        } else if (offendingSymbol.type === FaustLexer.ErrorChar) {
          error = `[${line}:${column}:${input}] Syntax Error: Unrecognized symbol "${input}"`;
        } else {
          const expected = recognizer.getExpectedTokens().toString(recognizer.literalNames, recognizer.symbolicNames);
          error = `[${line}:${column}:${input}:${expected}] Syntax Error: Expecting ${expected} but got "${input}"`;
        }

        break;
      default:
        if (msg.includes('extraneous input')) {
          error = `[${line}:${column}:${offendingSymbol.text}] Syntax Error: Unexpected token ${offendingSymbol.text}`;
        } else {
          error = `[${line}:${column}:${offendingSymbol.text}] Syntax Error: ${msg}`;
        }

        break;
    }

    this.parseErrors.push(error);

  }

  getInput(tokens, e) {
    let input;

    if (tokens !== null) {
      if (e.startToken && e.startToken.type === FaustLexer.EOF) {
        input = "<EOF>";
      } else {
        input = tokens.getText(new interval.Interval((e.startToken || e.offendingToken).tokenIndex, e.offendingToken.tokenIndex));
      }
    } else {
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
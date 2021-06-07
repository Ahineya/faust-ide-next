import antlr4 from "antlr4";
import FaustLexer from "./generated/FaustLexer.js";
import errors from "antlr4/src/antlr4/error/Errors.js";
import interval from "antlr4/src/antlr4/IntervalSet.js";

export class FaustErrorListener extends antlr4.error.ErrorListener {
  constructor() {
    super();
  }

  syntaxError(recognizer, offendingSymbol, line, column, msg, e) {

    if (e instanceof errors.NoViableAltException) {
      const currentRuleName = recognizer.ruleNames[recognizer._ctx.ruleIndex];

      const tokens = recognizer.getTokenStream()
      let input
      if (tokens !== null) {
        if (e.startToken && e.startToken.type === FaustLexer.EOF) {
          input = "<EOF>";
        } else {
          input = tokens.getText(new interval.Interval((e.startToken || e.offendingToken).tokenIndex, e.offendingToken.tokenIndex));
        }
      } else {
        input = "<unknown input>";
      }
      const err = "no viable alternative at input " + input;

      console.log(`[${line}:${column}] Syntax Error: expecting ${currentRuleName}, but got "${input}"`)
    } else {
      console.log(`[${line}:${column}] Syntax Error: ${msg}`)
    }


    console.log('MY ERROR');

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
import antlr4 from "antlr4";
import errors from "antlr4/src/antlr4/error/Errors.js";

class MissingTokenError {
  constructor() {
  }
}

export class FaustErrorStrategy extends antlr4.error.DefaultErrorStrategy {
  constructor() {
    super();
  }

  reportError(recognizer, e) {
    if (this.inErrorRecoveryMode(recognizer)) {
      return;
    }

    this.beginErrorCondition(recognizer);

    if (e instanceof errors.NoViableAltException) {
      this.reportNoViableAlternative(recognizer, e);
    } else if (e instanceof errors.InputMismatchException) {
      this.reportInputMismatch(recognizer, e);
    } else if (e instanceof errors.FailedPredicateException) {
      this.reportFailedPredicate(recognizer, e);
    } else {
      console.log("unknown recognition error type: " + e.constructor.name);
      console.log(e.stack);
      recognizer.notifyErrorListeners(e.getOffendingToken(), e.getMessage(), e);
    }
  }

  reportMissingToken(recognizer) {
    if (this.inErrorRecoveryMode(recognizer)) {
      return;
    }
    this.beginErrorCondition(recognizer);
    const t = recognizer.getCurrentToken();
    const expecting = this.getExpectedTokens(recognizer);

    if (expecting.length === 1) {
      const msg = "missing " + expecting.toString(recognizer.literalNames, recognizer.symbolicNames) +
        " at " + this.getTokenErrorDisplay(t)
      recognizer.notifyErrorListeners(msg, t, null);
    } else {
      const msg = "missing a lot of stuff" + expecting.toString(recognizer.literalNames, recognizer.symbolicNames) +
        " at " + this.getTokenErrorDisplay(t)
      recognizer.notifyErrorListeners(msg, t, null);
    }


  }

  reportUnwantedToken(recognizer) {
    console.log('HERE')
    if (this.inErrorRecoveryMode(recognizer)) {
      return;
    }
    this.beginErrorCondition(recognizer);
    const t = recognizer.getCurrentToken();
    const tokenName = this.getTokenErrorDisplay(t);
    const expecting = this.getExpectedTokens(recognizer);

    if (expecting.length === 1) {
      const msg = "extraneous input " + tokenName + " expecting " +
        expecting.toString(recognizer.literalNames, recognizer.symbolicNames)
      recognizer.notifyErrorListeners(msg, t, null);
    } else {
      const msg = "extraneous input " + tokenName;
      recognizer.notifyErrorListeners(msg, t, null);
    }


  }
}

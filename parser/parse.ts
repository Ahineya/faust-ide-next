import antlr4 from 'antlr4';

import FaustLexer from './generated/FaustLexer.js';
import FaustParser from './generated/FaustParser.js';
import {FaustErrorListener} from './FaustErrorListener.js';
import {FaustVisitor} from "./FaustVisitor.js";
import {FaustErrorStrategy} from "./FaustErrorStrategy.js";

const {CommonTokenStream, InputStream} = antlr4;

export const parse = (input: string, debug = false) => {
  const chars = new InputStream(input, true)
  const lexer = new FaustLexer(chars);
  const tokens = new CommonTokenStream(lexer);
  const parser = new FaustParser(tokens);

  //@ts-ignore
  parser._errHandler = new FaustErrorStrategy();

  parser.buildParseTrees = true;


  // TODO: Add errors gathering here

  if (!debug) {
    parser.removeErrorListeners();
  }

  const parseErrors: string[] = [];

  parser.addErrorListener(new FaustErrorListener(parseErrors));

  const tree = parser.program();

  const faustVisitor = new FaustVisitor();
  const AST = faustVisitor.visitProgram(tree);

  return {
    AST,
    errors: parseErrors
  };
}

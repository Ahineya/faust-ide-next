import antlr4 from 'antlr4';

import FaustLexer from './generated/FaustLexer.js';
import FaustParser from './generated/FaustParser.js';
import {FaustErrorListener} from './FaustErrorListener.js';
import {FaustVisitor} from "./FaustVisitor.js";

const {CommonTokenStream, InputStream} = antlr4;

//
// const input = `process = _;`;
//
// const chars = new InputStream(input, true)
// const lexer = new FaustLexer(chars);
// const tokens = new CommonTokenStream(lexer);
// const parser = new FaustParser(tokens);
//
// parser.buildParseTrees = true;
//
// parser.addErrorListener(new FaustErrorListener());
//
// const tree = parser.program();
//
// const faustVisitor = new FaustVisitor();
// const AST = faustVisitor.visitProgram(tree);
//
// console.log('AST', JSON.stringify(AST, null, 2));


export const parse = (input: string) => {
  const chars = new InputStream(input, true)
  const lexer = new FaustLexer(chars);
  const tokens = new CommonTokenStream(lexer);
  const parser = new FaustParser(tokens);

  parser.buildParseTrees = true;


  // TODO: Add errors gathering here

  parser.addErrorListener(new FaustErrorListener());

  const tree = parser.program();

  const faustVisitor = new FaustVisitor();
  const AST = faustVisitor.visitProgram(tree);

  return AST;

  // console.log('AST', JSON.stringify(AST, null, 2));
}

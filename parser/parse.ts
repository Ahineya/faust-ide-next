import antlr4 from 'antlr4';

import FaustLexer from './generated/FaustLexer.js';
import FaustParser from './generated/FaustParser.js';
import {FaustErrorListener} from './FaustErrorListener.js';
import {FaustVisitor} from "./FaustVisitor.js";
import {FaustErrorStrategy} from "./FaustErrorStrategy.js";
import {CommentLine, ILocation} from "./ast/nodes.interface";

const {CommonTokenStream, InputStream} = antlr4;

  // const getLocation = (t: any): ILocation {
  //   return {
  //     start: {
  //       line: ctx.start.line,
  //       column: ctx.start.column
  //     },
  //     end: {
  //       line: ctx.stop?.line,
  //       column: ctx.stop?.column
  //     }
  //   }
  // }

export const parse = (input: string, debug = false) => {
  const chars = new InputStream(input, true)
  const lexer = new FaustLexer(chars);
  const tokens = new CommonTokenStream(lexer);

  tokens.fill();
  console.log(tokens);


  tokens.tokens.filter(t => [FaustLexer.COMMENT, FaustLexer.LINE_COMMENT].includes(t.type))
    .map(t => {
      console.log('AAAAA', t);
    })

  // tokens.tokens.forEach(t => {
  //   if (t.type === FaustLexer.COMMENT || t.type === FaustLexer.LINE_COMMENT) {
  //     console.log(t.text);
  //
  //
  //   }
  // })

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

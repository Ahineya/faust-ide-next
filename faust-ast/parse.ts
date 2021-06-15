import antlr4 from 'antlr4';

import FaustLexer from './generated/FaustLexer.js';
import FaustParser from './generated/FaustParser.js';
import {FaustErrorListener} from './FaustErrorListener.js';
import {FaustVisitor} from "./FaustVisitor.js";
import {FaustErrorStrategy} from "./FaustErrorStrategy.js";
import {CommentBlock, CommentLine, ILocation} from "./ast/nodes.interface.js";

const {CommonTokenStream, InputStream} = antlr4;

  const getCommentLocation = (t: any): ILocation => {
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
    }
  }

export const parse = (input: string, debug = false) => {
  const chars = new InputStream(input, true)
  const lexer = new FaustLexer(chars);
  const tokens = new CommonTokenStream(lexer);

  tokens.fill();
  console.log(tokens);


  const comments = tokens.tokens.filter(t => [FaustLexer.COMMENT, FaustLexer.LINE_COMMENT].includes(t.type))
    .map(t => {
      if (t.type === FaustLexer.COMMENT) {
        return new CommentBlock(t.text, getCommentLocation(t));
      } else {
        return new CommentLine(t.text, getCommentLocation(t));
      }
    })

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
  AST.comments = comments;

  return {
    AST,
    errors: parseErrors
  };
}

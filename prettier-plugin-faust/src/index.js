const parser = require('faust-ast/build_node/parse');
const nodes = require('faust-ast/build_node/ast/nodes.interface.js');

const isNode = (node, nodeClass) => {
  if (!node) {
    return false;
  }

  if (Array.isArray(nodeClass)) {
    return nodeClass.some(nc => isNode(node, nc));
  }

  return node.constructor.name === nodeClass.type;
}


// import parser from "../../faust-ast/build/parse";

const {
  doc: {
    builders: {concat, hardline, line, softline, indent, group}
  }
} = require('prettier');

const languages = [
  {
    extensions: ['.dsp', '.toml'],
    name: 'Faust',
    parsers: ['faust-parse']
  }
];

const parsers = {
  'faust-parse': {
    parse: text => {
      const ast = parser.parse(text).AST;
      console.log(ast.comments);
      ast.comments.forEach(c => {
        c.value = c.text;
        console.log(c.text, c.location.range)
      });
      // return;x
      return ast;
    },
    astFormat: 'faust-ast',
    locStart: node => node.location.range[0],
    locEnd: node => node.location.range[1],
  }
};

function printComment(commentPath) {
  console.log('SHIT FUCK')
  const comment = commentPath.getValue();
  if (comment.printed) {
    console.log('already printed')
  }

  console.log('AAAAAAA', comment);

  return comment.text;
}

function printFaust(path, options, print) {
  const node = path.getValue();
  console.log(node);

  const p = property => path.call(print, property);

  if (node.comments) {
    console.log('NODE HAZ COMMENDZ');
    node.comments.forEach(c => {
      c.printed = true;
    })
  }

  if (Array.isArray(node)) {
    return concat(path.map(print));
  }

  if (isNode(node, nodes.Program)) {
    return concat([...path.map(print, 'body')]);
  }

  if (isNode(node, nodes.Import)) {
    return concat(['import("', node.source, '");', softline]);
  }

  if (isNode(node, nodes.Definition)) {
    const identifier = path.call(print, "id");
    if (identifier === 'process') {
      return concat([hardline, identifier, ' = ', path.call(print, 'expression'), ';', softline]);
    }

    return concat([identifier, ' = ', path.call(print, 'expression'), ';', softline]);
  }

  if (isNode(node, nodes.IdentifierDeclaration)) {
    return node.name;
  }

  if (isNode(node, nodes.WirePrimitive)) {
    return '_';
  }

  if (isNode(node, nodes.PatternDefinition)) {
    const identifier = path.call(print, "id");
    const args = path.map(print, 'args');
    const expression = path.call(print, "expression");

    return indent(concat([identifier, group(concat([
      '(', args.join(', '), ')'
    ])), ' = ', expression, ';']));
  }

  if (isNode(node, nodes.WithExpression)) {
    const expression = p("expression");
    const context = path.map(print, "context");

    return concat([
      expression,
      hardline,
      'with ', '{', hardline,
      indent(concat([...context])), hardline,
      '}']);
  }

  if (isNode(node, nodes.BinaryExpression)) {
    const left = p('left');
    const right = p('right');

    return concat(['(', left, ` ${node.operator} `, right, ')']);
  }

  if (isNode(node, nodes.Identifier)) {
    return node.name;
  }

  if (isNode(node, nodes.ApplicationExpression)) {
    return 'APPLICATION';
  }

  if (isNode(node, nodes.NumberPrimitive)) {
    return `${node.value}`;
  }

  if (isNode(node, nodes.PostfixDelayExpression)) {
    const expression = p("expression");

    return concat([expression, "'"]);
  }

  throw new Error(node.constructor.name);
}

function addCommentHelper(node, comment) {
  const comments = node.comments || (node.comments = []);
  comments.push(comment);
  comment.printed = false;
  // comment.nodeDescription = describeNodeForDebugging(node);
}

function addLeadingComment(node, comment) {
  comment.leading = true;
  comment.trailing = false;
  addCommentHelper(node, comment);
}

function addDanglingComment(node, comment, marker) {
  comment.leading = false;
  comment.trailing = false;
  if (marker) {
    comment.marker = marker;
  }
  addCommentHelper(node, comment);
}

function addTrailingComment(node, comment) {
  comment.leading = false;
  comment.trailing = true;
  addCommentHelper(node, comment);
}

function addDanglingComment(node, comment, marker) {
  comment.leading = false;
  comment.trailing = false;
  if (marker) {
    comment.marker = marker;
  }
  addCommentHelper(node, comment);
}

const printers = {
  'faust-ast': {
    preprocess: (ast) => {
      console.log('preprocess', ast);

      // console.log('comments', ast.AST.comments);
      // ast.AST.comments.forEach(c => c.value = c.text);

      return ast;
    },
    print: printFaust,
    printComment,
    canAttachComment: (what) => {
      return what instanceof nodes.BaseNode;
    },
    isBlockComment: (context) => {
      console.log('isBlockComment', context);
      // return context instanceof nodes.CommentBlock;
    },//console.log('isBlockComment called')},
    handleComments: {
      avoidAstMutation: true,
      ownLine: () => {
        console.log('ownLine called')
      },
      endOfLine: () => {
        console.log('endOfLine called')
      },
      remaining: (context) => {

        console.log('remaining called', context);


        // addTrailingComment(context.precedingNode, context.text);
        return false;
      },
    },
    // willPrintOwnComments: (path) => {
    //   const node = path.getValue();
    //   return isNode(node, nodes.Definition);
    // },
//   getCommentChildNodes: () => {return [];console.log('getCommentChildNodes')}
  }
};

module.exports = {
  languages,
  parsers,
  printers
};

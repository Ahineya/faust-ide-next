import {MephistoBaseVisitor} from "./mephisto.visitor";
import {
  BaseNode,
  Definition,
  Environment,
  IterativeExpression,
  LambdaExpression,
  WithExpression,
  IdentifierDeclaration,
  PatternDefinition,
  Program,
  Identifier
} from "../../parser/build/ast/nodes.interface";
import {FSymbol, SymbolTable} from "./mephisto.symboltable";
import {isNode} from "./mephisto.helpers";



export class MephistoScopeVisitor extends MephistoBaseVisitor {
  private scopeCounter = 0;
  private scopeStack: number[] = [];

  private symbolTable = new SymbolTable();

  constructor(public debug = false) {
    super(debug);
  }

  public visit(node: BaseNode, parent?: BaseNode) {
    super.visit(node, parent);
    node.scope = this.scopeStack[this.scopeStack.length - 1];
  }

  public getSymbolTable() {
    return this.symbolTable;
  }

  public visitProgram(node: Program) {
    this.scopeStack.push(this.scopeCounter);
    this.visitChildren(node);
  }

  public visitDefinition(node: Definition) {
    // Visit id with current scope

    this.visitIdentifierDeclaration(node.id, node);

    if (node.args) {
      this.scopeCounter++;
      this.scopeStack.push(this.scopeCounter);
      node.args.forEach((a: BaseNode) => this.visit(a, node));
    }

    this.visit(node.expression);

    if (node.args) {
      this.scopeStack.pop();
    }
  }

  public visitPatternDefinition(node: PatternDefinition) {
    // Visit id with current scope

    // here we are allowing redeclaration
    this.visitIdentifierDeclaration(node.id, node, true);

    this.scopeCounter++;
    this.scopeStack.push(this.scopeCounter);

    node.args.forEach((a: BaseNode) => this.visit(a, node));
    // Visit args with new scope
    this.visit(node.expression);
    // Visit expression with new scope

    this.scopeStack.pop();
  }

  public visitWithExpression(node: WithExpression) {
    this.scopeCounter++;
    this.scopeStack.push(this.scopeCounter);
    super.visitWithExpression(node);
    this.scopeStack.pop();
  }

  public visitLambdaExpression(node: LambdaExpression) {
    this.scopeCounter++;
    this.scopeStack.push(this.scopeCounter);

    node.params.map((p: IdentifierDeclaration) => this.visitIdentifierDeclaration(p, node, true));
    this.visit(node.expression, node);

    this.scopeStack.pop();
  }

  public visitEnvironment(node: Environment) {
    this.scopeCounter++;
    this.scopeStack.push(this.scopeCounter);
    super.visitEnvironment(node);
    this.scopeStack.pop();
  }

  public visitIterativeExpression(node: IterativeExpression) {
    this.scopeCounter++;
    this.scopeStack.push(this.scopeCounter);
    super.visitIterativeExpression(node);
    this.scopeStack.pop();
  }

  public visitIdentifierDeclaration(node: IdentifierDeclaration, parent?: BaseNode, patternDeclaration = false) {

    if (!parent) {
      return;
    }

    // Think what to do with pattern matching. for now just allowing redeclaration

    let patternIdentifier = patternDeclaration;

    // if (isNode(parent, PatternDefinition)) {
    //   patternIdentifier = true;
    // }

    const symbol = new FSymbol(
      node.name,
      parent,
      this.scopeStack[this.scopeStack.length - 1],
      patternIdentifier
        ? 'patternDeclaration'
        : 'declaration',
      [...this.scopeStack]
    );

    if (this.symbolTable.has(symbol.name, symbol.scope)) {

      const s = this.symbolTable.get(symbol.name, symbol.scope) as FSymbol;

      if (
        s.category === 'patternDeclaration' && symbol.category === 'declaration'
        || s.category === 'declaration' && symbol.category === 'patternDeclaration'
        || s.category === 'declaration' && symbol.category === 'declaration'
      ) {
        this.error(node, `Identifier "${node.name}" has been already declared at line ${s.astNode.location.start.line}`);
        return;
      }

      this.symbolTable.insert(symbol);
      return;
    }

    this.symbolTable.insert(symbol);
  }

  visitIdentifier(node: Identifier, parent?: BaseNode) {
    node.scopeStack = [...this.scopeStack];
  }
}

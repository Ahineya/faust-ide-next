import {BaseNode} from "../../faust-ast/build/ast/nodes.interface";

export class FSymbol {
  constructor(
    public name: string,
    public astNode: BaseNode,
    public scope: number,
    public category: string,
    public scopesStack: number[], // Yep, should be a list, not an array
  ) {
  }
}

export class SymbolTable {
  private symbols = new Map<string, FSymbol[]>();

  has(name: string, scope: number): boolean {
    if (!this.symbols.has(name)) {
      return false;
    }

    const symbolsList = this.symbols.get(name) as FSymbol[];

    for (let i = 0; i < symbolsList.length; i++) {
      if (symbolsList[i].name === name && symbolsList[i].scope === scope) {
        return true;
      }
    }

    return false;
  }

  get(name: string, scope: number): FSymbol | null {
    if (!this.symbols.has(name)) {
      return null;
    }

    const symbolsList = this.symbols.get(name) as FSymbol[];

    for (let i = 0; i < symbolsList.length; i++) {
      if (symbolsList[i].name === name && symbolsList[i].scope === scope) {
        return symbolsList[i];
      }
    }

    return null;
  }

  getWithScope(name: string, scopes: number[]): FSymbol | null {
    if (!this.symbols.has(name)) {
      return null;
    }

    const symbolsList = this.symbols.get(name) as FSymbol[];

    const reversedScopes = scopes.reverse();

    for (let j = 0; j < reversedScopes.length; j++) {
      for (let i = 0; i < symbolsList.length; i++) {
        if (symbolsList[i].name === name && symbolsList[i].scope === reversedScopes[j]) {
          return symbolsList[i];
        }
      }
    }

    return null;
  }

  insert(symbol: FSymbol) {
    if (!this.symbols.has(symbol.name)) {
      this.symbols.set(symbol.name, []);
    }

    const symbolsList = this.symbols.get(symbol.name) as FSymbol[];

    symbolsList.push(symbol);
  }

  getSymbolsByASTNode(node: BaseNode) {
    Array.from(this.symbols.values()).find(symbolsList => symbolsList.filter(symbol => symbol.astNode === node));
  }
}

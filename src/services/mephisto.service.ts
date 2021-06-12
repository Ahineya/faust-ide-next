import {parse} from "../../parser/build/parse.js";
import {debounce} from "../helpers/debounce";
import {
  BaseNode,
  Definition, Environment,
  IdentifierDeclaration, IterativeExpression,
  LambdaExpression, Pattern, PatternDefinition, Program,
  WithExpression
} from "../../parser/build/ast/nodes.interface.js";
import {MephistoScopeVisitor} from "./mephisto.scope.visitor";
import {MephistoTyperVisitor} from "./mephisto.typer.visitor";
import {FSymbol} from "./mephisto.symboltable";

class MephistoService {
  parseFaustCode(code: string) {
    console.log('=============');
    const {AST, errors} = parse(code, true);
    if (errors) {
      console.log(errors);
    }

    const msv = new MephistoScopeVisitor();

    msv.visitProgram(AST as unknown as Program);

    console.log('AST', AST);

    const symbolTableErrors = msv.getErrors();
    if (!symbolTableErrors.length) {
      const symbolTable = msv.getSymbolTable();
      console.log('Symbol table', symbolTable);

      const process = symbolTable.get('process', 0);

      if (process && process.astNode) {
        const typer = new MephistoTyperVisitor(symbolTable, true);
        typer.visit(process.astNode);

        const typeErrors = typer.getErrors();
        if (typeErrors.length) {
          console.log('Type errors:', typeErrors);
        }
      } else {
        console.log('No process definition');
      }


    } else {
      console.log(symbolTableErrors);
    }


    console.log('=============');
  }

  debouncedParseFaustCode: (code: string) => unknown = debounce((code: string) => this.parseFaustCode(code), 500);
}

export const mephisto = new MephistoService();

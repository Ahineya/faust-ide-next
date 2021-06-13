import {parse} from "../../parser/build/parse.js";
import {debounce} from "../helpers/debounce";
import {
  Program,
  BaseNode,
  ParIteration,
  ProdIteration, SeqIteration, SumIteration,
  Route
} from "../../parser/build/ast/nodes.interface.js";
import {MephistoScopeVisitor} from "./mephisto.scope.visitor";
import {MephistoValidatorVisitor} from "./mephisto.validator.visitor";
import {isNode} from "./mephisto.helpers";
import {MephistoPrettyPrintVisitor} from "./mephisto.prettyprint.visitor";

class MephistoService {
  parseFaustCode(code: string) {
    console.log('=============');
    const {AST, errors} = parse(code, true);
    if (errors) {
      console.log(errors);
    }

    const pretty = new MephistoPrettyPrintVisitor();

    const prettyfied = pretty.visit(AST);
    console.log(prettyfied);

    const msv = new MephistoScopeVisitor();

    msv.visitProgram(AST as unknown as Program);

    console.log('AST', AST);

    const symbolTableErrors = msv.getErrors();
    if (!symbolTableErrors.length) {
      const symbolTable = msv.getSymbolTable();
      console.log('Symbol table', symbolTable);

      const process = symbolTable.get('process', 0);

      if (process && process.astNode) {

        process.astNode.process(((node: BaseNode) => {
          if (isNode(node, ParIteration)) {
            console.log('Program contains par iteration, evaluation needed for validation');
          }
          if (isNode(node, SeqIteration)) {
            console.log('Program contains seq iteration, evaluation needed for validation');
          }
          if (isNode(node, SumIteration)) {
            console.log('Program contains sum iteration, evaluation needed for validation');
          }
          if (isNode(node, ProdIteration)) {
            console.log('Program contains prod iteration, evaluation needed for validation');
          }
          if (isNode(node, Route)) {
            console.log('Program contains route, evaluation needed for validation');
          }
        }));

        const typer = new MephistoValidatorVisitor(symbolTable, true);
        typer.visit(process.astNode);

        const typeErrors = typer.getErrors();
        if (typeErrors.length) {
          console.log('Type errors:', typeErrors.map(te => te.toString()));
        } else {

          console.log(`No errors. Process has ${process.astNode.insN} inputs and ${process.astNode.outsN} outputs`)

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

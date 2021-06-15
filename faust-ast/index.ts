import {parse} from "./parse.js";
import fs from "fs";

const [filename, outFileName] = process.argv.slice(2);

const text = filename
  ? fs.readFileSync(filename, 'utf-8')
  : `declare author "Pavlo";`;


const AST = parse(text);

const stringAST = JSON.stringify(AST, null, 2);

console.log(stringAST);
console.log(text);
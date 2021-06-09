import {parse} from "./parse.js";
import fs from "fs";

const [filename, outFileName] = process.argv.slice(2);

const text = filename
  ? fs.readFileSync(filename, 'utf-8')
  : `duplicate = case { 
  (1,x) => x; 
  (n,x) => x, duplicate(n-1,x); 
};`;


const AST = parse(text);

const stringAST = JSON.stringify(AST, null, 2);

console.log(stringAST);

// fs.writeFileSync(outFileName, stringAST, 'utf-8');

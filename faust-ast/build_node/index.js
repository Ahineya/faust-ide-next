"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parse_js_1 = require("./parse.js");
const fs_1 = __importDefault(require("fs"));
const [filename, outFileName] = process.argv.slice(2);
const text = filename
    ? fs_1.default.readFileSync(filename, 'utf-8')
    : `declare author "Pavlo";`;
const AST = parse_js_1.parse(text);
const stringAST = JSON.stringify(AST, null, 2);
console.log(stringAST);
console.log(text);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const __dirname = path_1.default.dirname(url_1.fileURLToPath(import.meta.url));
const filename = `${__dirname}/../generated/FaustParser.js`;
const file = fs_1.default.readFileSync(filename, 'utf-8');
const fileWithExportedClasses = file.replace(/class/g, 'export class')
    .replace('export default export class', 'export default class');
fs_1.default.writeFileSync(filename, fileWithExportedClasses, 'utf-8');

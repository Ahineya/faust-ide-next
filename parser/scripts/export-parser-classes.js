import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filename = `${__dirname}/../generated/FaustParser.js`;

const file = fs.readFileSync(filename, 'utf-8');

const fileWithExportedClasses = file.replace(/class/g, 'export class')
  .replace('export default export class', 'export default class');

fs.writeFileSync(filename, fileWithExportedClasses, 'utf-8');

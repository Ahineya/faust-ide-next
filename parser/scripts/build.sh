#!/usr/bin/env bash
CLASSPATH=".:$HOME/antlr-4.9.2-complete.jar:$CLASSPATH"
echo $CLASSPATH
antlr4="java -Xmx500M -cp \"$HOME/antlr-4.9-complete.jar:$CLASSPATH\" org.antlr.v4.Tool"
$antlr4 -Dlanguage=JavaScript FaustLexer.g4 -o generated
$antlr4 -Dlanguage=JavaScript FaustParser.g4 -o generated
$antlr4 -Dlanguage=JavaScript FaustParser.g4 -visitor -o generated

# ANTLR generates parser in JS, and it's context classes can not be imported by TypeScript.
# Adding some dirty .replace stuff here.
node scripts/export-parser-classes.js
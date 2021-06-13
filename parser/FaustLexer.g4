lexer grammar FaustLexer;

fragment DIGIT : [0-9];
fragment ID : [a-zA-Z][_a-zA-Z0-9]*;
fragment LETTER : [a-zA-Z];
fragment NUMBER : DIGIT+'.'DIGIT* | '.'DIGIT+ | DIGIT+;
fragment PLUS_MINUS : '+' | '-';
fragment ESC : '\\"' | '\\\\' ;

//WSPACE : [ \t\r\n] -> skip;



INT : DIGIT+;
FLOAT : DIGIT+'f'
    | DIGIT+'.'DIGIT*
    | DIGIT+'.'DIGIT*'f'
    | DIGIT+'.'DIGIT*'e'PLUS_MINUS?DIGIT+
    | DIGIT+'.'DIGIT*'e'PLUS_MINUS?DIGIT+'f'
    | DIGIT+'e'PLUS_MINUS?DIGIT+
    | DIGIT+'e'PLUS_MINUS?DIGIT+'f'
    | '.'DIGIT+
    | '.'DIGIT+'f'
    | '.'DIGIT+'e'PLUS_MINUS?DIGIT+
    | '.'DIGIT+'e'PLUS_MINUS?DIGIT+'f'
    ;

SEQ : ':';
PAR : ',';
SPLIT : '<:';
MIX : '+>' | ':>';
REC : '~';

ADD : '+';
SUB : '-';
MUL : '*';
DIV : '/';
MOD : '%';
FDELAY : '@';
DELAY1 : '\'';

AND : '&';
OR : '|';
XOR : 'xor';

LSH : '<<';
RSH : '>>';

LT : '<';
LE : '<=';
GT : '>';
GE : '>=';
EQ : '==';
NE : '!=';

WIRE : '_';
CUT : '!';

ENDDEF : ';';
DEF : '=';
LPAR : '(';
RPAR : ')';
LBRAQ : '{';
RBRAQ : '}';
LCROC : '[';
RCROC : ']';

LAMBDA : '\\';
DOT : '.';
WITH : 'with';
LETREC : 'letrec';

MEM : 'mem';
PREFIX : 'prefix';

INTCAST : 'int';
FLOATCAST : 'float';

RDTBL : 'rdtable';
RWTBL : 'rwtable';

SELECT2 : 'select2';
SELECT3 : 'select3';

FFUNCTION : 'ffunction';
FCONSTANT : 'fconstant';
FVARIABLE : 'fvariable';

BUTTON : 'button';
CHECKBOX : 'checkbox';
VSLIDER : 'vslider';
HSLIDER : 'hslider';
NENTRY : 'nentry';
VGROUP : 'vgroup';
HGROUP : 'hgroup';
TGROUP : 'tgroup';
VBARGRAPH : 'vbargraph';
HBARGRAPH : 'hbargraph';
SOUNDFILE : 'soundfile';

ATTACH : 'attach';

ACOS : 'acos';
ASIN : 'asin';
ATAN : 'atan';
ATAN2 : 'atan2';

COS : 'cos';
SIN : 'sin';
TAN : 'tan';

EXP : 'exp';
LOG : 'log';
LOG10 : 'log10';
POWOP : '^';
POWFUN : 'pow';
SQRT : 'sqrt';

ABS : 'abs';
MIN : 'min';
MAX : 'max';

FMOD : 'fmod';
REMAINDER : 'remainder';

FLOOR : 'floor';
CEIL : 'ceil';
RINT : 'rint';

ISEQ : 'seq';
IPAR : 'par';
ISUM : 'sum';
IPROD : 'prod';

INPUTS : 'inputs';
OUTPUTS : 'outputs';

IMPORT : 'import';
COMPONENT : 'component';
LIBRARY : 'library';
ENVIRONMENT : 'environment';

WAVEFORM : 'waveform';
ROUTE : 'route';
ENABLE : 'enable';
CONTROL : 'control';

DECLARE : 'declare';

CASE : 'case';
ARROW : '=>';

FLOATMODE : 'singleprecision';
DOUBLEMODE : 'doubleprecision';
QUADMODE : 'quadprecision';
FIXEDPOINTMODE : 'fixedpointprecision';

IDENT : '_'ID | ID;

STRING : '"' ( ESC | ~[\\"\r] )* '"';
UNTERMINATED_STRING : '"' ( ESC | ~[\\"\r] )* ;

FSTRING : '<'LETTER*'>' | '<'LETTER*'.'LETTER'>';

COMMENT : '/*' .*? '*/' -> channel(2);
LINE_COMMENT : '//' ~[\r\n]* -> channel(2);
MDOC: '<mdoc>' .*? '</mdoc>' -> skip;

WSPACE : [ \t\r\n]+ -> skip;

ErrorChar : . ;
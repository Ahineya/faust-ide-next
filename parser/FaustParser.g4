parser grammar FaustParser;

options {
    tokenVocab=FaustLexer;
    }

variantstatement: precision = variant variantStatement = statement;
program : (statement | variantstatement)* EOF;

variant : FLOATMODE | DOUBLEMODE | QUADMODE | FIXEDPOINTMODE;

importStatement : IMPORT LPAR importName = uqstring RPAR ENDDEF;
statement : imp = importStatement
    | DECLARE decname = name decval = string ENDDEF
    | DECLARE decname = name decarg = name decval = string ENDDEF
    | def = definition
//    | BDOC doc ENDDOC
;

definition
    : identname = defname LPAR args = arglist RPAR DEF expr = expression ENDDEF
    | identname = defname DEF expr = expression ENDDEF;

defname: ident;

arglist : arg = argument | list = arglist op = PAR arg = argument;

reclist : recinition*;

recinition: identname = recname DEF expr = expression ENDDEF;

recname : DELAY1 identname = ident;

deflist : variant | definition;

argument : <assoc=right>left = argument op = SEQ right = argument
    | <assoc=right> left = argument op = (SPLIT|MIX) right = argument
    | left = argument op = REC right = argument
    | expr = infixexpr;

params : ident | params PAR ident;

withdef : (definition | variant definition)*;

expression : infexpr = infixexpr
    | expr = expression op=WITH LBRAQ defs = withdef RBRAQ
    | expr = expression op=LETREC LBRAQ recs = reclist RBRAQ
    | left = expression op=REC right = expression
    | <assoc=right> left = expression op=PAR right = expression
    | <assoc=right> left = expression op=SEQ right = expression
    | <assoc=right> left = expression op=(SPLIT|MIX) right = expression;

infixexpr
    : prim = primitive

    | left = infixexpr op = FDELAY right = infixexpr
    | expr = infixexpr op = DELAY1

    | left = infixexpr op = DOT identificator = ident

    | left = infixexpr op = POWOP right = infixexpr

    | left = infixexpr op = LSH right = infixexpr
    | left = infixexpr op = RSH right = infixexpr

    | left = infixexpr op = MUL right = infixexpr
    | left = infixexpr op = DIV right = infixexpr

    | left = infixexpr op = MOD right = infixexpr

    | left = infixexpr op = ADD right = infixexpr
    | left = infixexpr op = SUB right = infixexpr

    | left = infixexpr op = AND right = infixexpr
    | left = infixexpr op = OR right = infixexpr
    | left = infixexpr op = XOR right = infixexpr

    | left = infixexpr op = LT right = infixexpr
    | left = infixexpr op = LE right = infixexpr
    | left = infixexpr op = GT right = infixexpr
    | left = infixexpr op = GE right = infixexpr
    | left = infixexpr op = EQ right = infixexpr
    | left = infixexpr op = NE right = infixexpr

    | callee = infixexpr LPAR arguments = arglist RPAR
    | left = infixexpr LCROC definitions = deflist* RCROC // EXPLICIT SUBSTITUTION, replacing what in scope with custom definitions
;

primitive
    : value = INT
    | value = FLOAT
    | sign = ADD value = INT
    | sign = ADD value = FLOAT
    | sign = SUB value = INT
    | sign = SUB value = FLOAT
    
    | wire = WIRE
    | cut = CUT
    
    | primitivetype = MEM
    | primitivetype = PREFIX
    
    | primitivetype = INTCAST
    | primitivetype = FLOATCAST
    
    | primitivetype = ADD
    | primitivetype = SUB
    | primitivetype = MUL
    | primitivetype = DIV
    | primitivetype = MOD
    | primitivetype = FDELAY
    
    | primitivetype = AND
    | primitivetype = OR
    | primitivetype = XOR
    
    | primitivetype = LSH
    | primitivetype = RSH
    
    | primitivetype = LT
    | primitivetype = LE
    | primitivetype = GT
    | primitivetype = GE
    | primitivetype = EQ
    | primitivetype = NE
    
    | primitivetype = ATTACH
    | primitivetype = ENABLE
    | primitivetype = CONTROL
    
    | primitivetype = ACOS
    | primitivetype = ASIN
    | primitivetype = ATAN
    | primitivetype = ATAN2
    | primitivetype = COS
    | primitivetype = SIN
    | primitivetype = TAN
    
    | primitivetype = EXP
    | primitivetype = LOG
    | primitivetype = LOG10
    | primitivetype = POWOP
    | primitivetype = POWFUN
    | primitivetype = SQRT
    
    | primitivetype = ABS
    | primitivetype = MIN
    | primitivetype = MAX
    
    | primitivetype = FMOD
    | primitivetype = REMAINDER
    
    | primitivetype = FLOOR
    | primitivetype = CEIL
    | primitivetype = RINT
    
    | primitivetype = RDTBL
    | primitivetype = RWTBL
    
    | primitivetype = SELECT2
    | primitivetype = SELECT3
    
    | primitiveident = ident
    | sign = SUB primitiveident = ident
    
    | LPAR primitiveexpr = expression RPAR
    | LAMBDA LPAR params RPAR DOT LPAR expression RPAR
    | CASE LBRAQ caserulelist RBRAQ
    | ffunction
    | fconst
    | fvariable

    | component = COMPONENT LPAR source = uqstring RPAR
    | library = LIBRARY LPAR source = uqstring RPAR
    | environment = ENVIRONMENT LBRAQ (statement | variantstatement)* RBRAQ
    | waveform = WAVEFORM LBRAQ values = vallist RBRAQ
    | route = ROUTE LPAR ins = argument PAR outs = argument PAR pairs = expression RPAR

    | button
    | checkbox
    | vslider
    | hslider
    | nentry
    | vgroup
    | hgroup
    | tgroup
    | vbargraph
    | hbargraph
    | soundfile

    | fpar
    | fseq
    | fsum
    | fprod

    | finputs
    | foutputs
;

ffunction : FFUNCTION LPAR signature PAR fstring PAR string RPAR;
fconst : FCONSTANT LPAR type name PAR fstring RPAR;
fvariable : FVARIABLE LPAR type name PAR fstring RPAR;

button : BUTTON LPAR caption = uqstring RPAR;
checkbox : CHECKBOX LPAR caption = uqstring RPAR;
vslider : VSLIDER LPAR caption = uqstring PAR initial = argument PAR min = argument PAR max = argument PAR step = argument RPAR;
hslider : HSLIDER LPAR caption = uqstring PAR initial = argument PAR min = argument PAR max = argument PAR step = argument RPAR;
nentry : NENTRY LPAR caption = uqstring PAR initial = argument PAR min = argument PAR max = argument PAR step = argument RPAR;
vgroup : VGROUP LPAR caption = uqstring PAR expr = expression RPAR;
hgroup : HGROUP LPAR caption = uqstring PAR expr = expression RPAR;
tgroup : TGROUP LPAR caption = uqstring PAR expr = expression RPAR;
vbargraph : VBARGRAPH LPAR caption = uqstring PAR min = argument PAR max = argument RPAR;
hbargraph : HBARGRAPH LPAR caption = uqstring PAR min = argument PAR max = argument RPAR;
soundfile : SOUNDFILE LPAR caption = uqstring PAR outs = argument RPAR;

fpar : op = IPAR LPAR id = ident PAR arg = argument PAR expr = expression RPAR;
fseq : op = ISEQ LPAR id = ident PAR arg = argument PAR expr = expression RPAR;
fsum : op = ISUM LPAR id = ident PAR arg = argument PAR expr = expression RPAR;
fprod : op = IPROD LPAR id = ident PAR arg = argument PAR expr = expression RPAR;

finputs : INPUTS LPAR expr = expression RPAR;
foutputs : OUTPUTS LPAR expr = expression RPAR;

caserulelist : caserule | caserulelist caserule;
caserule : LPAR arglist RPAR ARROW expression ENDDEF;

ident: identname = IDENT;
uqstring : STRING;
fstring : STRING | FSTRING;
vallist : n = number | list = vallist PAR n = number;
number : n = INT
    | n = FLOAT
    | sign = ADD n = INT
    | sign = ADD n = FLOAT
    | sign = SUB n = INT
    | sign = SUB n = FLOAT;
string : STRING;
name : IDENT;
type : INTCAST | FLOATCAST;
signature : type fun LPAR typelist RPAR;

fun: singleprecisionfun | singleprecisionfun OR doubleprecisionfun | singleprecisionfun OR doubleprecisionfun OR quadprecisionfun;
singleprecisionfun : IDENT;
doubleprecisionfun : IDENT;
quadprecisionfun : IDENT;


typelist : type | typelist PAR type;
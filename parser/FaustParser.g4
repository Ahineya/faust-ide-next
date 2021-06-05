parser grammar FaustParser;

options {
    tokenVocab=FaustLexer;
    }

statementlist : statement | variantlist statement;
program : (statementlist)* EOF;

variantlist : variant;
variant : FLOATMODE | DOUBLEMODE | QUADMODE | FIXEDPOINTMODE;

importStatement : IMPORT LPAR uqstring RPAR ENDDEF;
statement : importStatement
    | DECLARE name string ENDDEF
    | DECLARE name name string ENDDEF
    | definition
//    | BDOC doc ENDDOC
;

definition
    : defname LPAR arglist RPAR DEF expression ENDDEF
    | defname DEF expression ENDDEF;

defname: ident;

arglist : argument
    | arglist PAR argument;

reclist : recinition*;

recinition: recname DEF expression ENDDEF;

recname : DELAY1 ident;

deflist : variantlist | definition;

argument : argument SEQ argument
    | argument SPLIT argument
    | argument MIX argument
    | argument REC argument
    | infixexpr;

params : ident | params PAR ident;

expression : infixexpr
    | expression WITH LBRAQ (definition | variantlist)+ RBRAQ
    | expression LETREC LBRAQ reclist RBRAQ
    | expression REC expression
    | expression PAR expression
    | expression SEQ expression
    | expression SPLIT expression
    | expression MIX expression;

infixexpr
    : primitive

    | infixexpr FDELAY infixexpr
    | infixexpr DELAY1

    | infixexpr DOT ident

    | infixexpr POWOP infixexpr

    | infixexpr LSH infixexpr
    | infixexpr RSH infixexpr

    | infixexpr MUL infixexpr
    | infixexpr DIV infixexpr

    | infixexpr MOD infixexpr

    | infixexpr ADD infixexpr
    | infixexpr SUB infixexpr

    | infixexpr AND infixexpr
    | infixexpr OR infixexpr
    | infixexpr XOR infixexpr

    | infixexpr LT infixexpr
    | infixexpr LE infixexpr
    | infixexpr GT infixexpr
    | infixexpr GE infixexpr
    | infixexpr EQ infixexpr
    | infixexpr NE infixexpr

    | infixexpr LPAR arglist RPAR
    | infixexpr LCROC deflist* RCROC
;

primitive
    : INT
    | FLOAT
    | ADD INT
    | ADD FLOAT
    | SUB INT
    | SUB FLOAT
    
    | WIRE
    | CUT
    
    | MEM
    | PREFIX
    
    | INTCAST
    | FLOATCAST
    
    | ADD
    | SUB
    | MUL
    | DIV
    | MOD
    | FDELAY
    
    | AND
    | OR
    | XOR
    
    | LSH
    | RSH
    
    | LT
    | LE
    | GT
    | GE
    | EQ
    | NE
    
    | ATTACH
    | ENABLE
    | CONTROL
    
    | ACOS
    | ASIN
    | ATAN
    | ATAN2
    | COS
    | SIN
    | TAN
    
    | EXP
    | LOG
    | LOG10
    | POWOP
    | POWFUN
    | SQRT
    
    | ABS
    | MIN
    | MAX
    
    | FMOD
    | REMAINDER
    
    | FLOOR
    | CEIL
    | RINT
    
    | RDTBL
    | RWTBL
    
    | SELECT2
    | SELECT3
    
    | ident
    | SUB ident
    
    | LPAR expression RPAR
    | LAMBDA LPAR params RPAR DOT LPAR expression RPAR
    | CASE LBRAQ rulelist RBRAQ
    | ffunction
    | fconst
    | fvariable
    | COMPONENT LPAR uqstring RPAR
    | LIBRARY LPAR uqstring RPAR
    | ENVIRONMENT LBRAQ (statement | variantlist)* RBRAQ
    | WAVEFORM LBRAQ vallist RBRAQ
    | ROUTE LPAR argument PAR argument PAR expression RPAR
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

button : BUTTON LPAR uqstring RPAR;
checkbox : CHECKBOX LPAR uqstring RPAR;
vslider : VSLIDER LPAR uqstring PAR argument PAR argument PAR argument PAR argument RPAR;
hslider : HSLIDER LPAR uqstring PAR argument PAR argument PAR argument PAR argument RPAR;
nentry : NENTRY LPAR uqstring PAR argument PAR argument PAR argument PAR argument RPAR;
vgroup : VGROUP LPAR uqstring PAR expression RPAR;
hgroup : HGROUP LPAR uqstring PAR expression RPAR;
tgroup : TGROUP LPAR uqstring PAR expression RPAR;
vbargraph : VBARGRAPH LPAR uqstring PAR argument PAR argument RPAR;
hbargraph : HBARGRAPH LPAR uqstring PAR argument PAR argument RPAR;
soundfile : SOUNDFILE LPAR uqstring PAR argument RPAR;

fpar : IPAR LPAR ident PAR argument PAR expression RPAR;
fseq : ISEQ LPAR ident PAR argument PAR expression RPAR;
fsum : ISUM LPAR ident PAR argument PAR expression RPAR;
fprod : IPROD LPAR ident PAR argument PAR expression RPAR;
finputs : INPUTS LPAR expression RPAR;
foutputs : OUTPUTS LPAR expression RPAR;

rulelist : rule | rulelist rule;

rule : LPAR arglist RPAR ARROW expression ENDDEF;

ident: IDENT;
uqstring : STRING;
fstring : STRING | FSTRING;
vallist : number | vallist PAR number;
number : INT
    | FLOAT
    | ADD INT
    | ADD FLOAT
    | SUB INT
    | SUB FLOAT;
string : STRING;
name : IDENT;
type : INTCAST | FLOATCAST;
signature : type fun LPAR typelist RPAR;

fun: singleprecisionfun | singleprecisionfun OR doubleprecisionfun | singleprecisionfun OR doubleprecisionfun OR quadprecisionfun;
singleprecisionfun : IDENT;
doubleprecisionfun : IDENT;
quadprecisionfun : IDENT;


typelist : type | typelist PAR type;
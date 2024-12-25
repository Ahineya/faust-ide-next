"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdIteration = exports.SeqIteration = exports.SumIteration = exports.ParIteration = exports.IterativeExpression = exports.Soundfile = exports.HbargraphControl = exports.VbargraphControl = exports.BargraphControl = exports.NentryControl = exports.HsliderControl = exports.VsliderControl = exports.TGroupControl = exports.HGroupControl = exports.VGroupControl = exports.GroupControl = exports.NumericInputControl = exports.CheckboxControl = exports.ButtonControl = exports.OutputControl = exports.InputControl = exports.Control = exports.PostfixDelayExpression = exports.UnaryExpression = exports.BroadPrimitive = exports.CutPrimitive = exports.WirePrimitive = exports.NumberPrimitive = exports.Primitive = exports.ApplicationExpression = exports.BinaryExpression = exports.LetrecExpression = exports.WithExpression = exports.CompositionExpression = exports.Declare = exports.Library = exports.Component = exports.Import = exports.Pattern = exports.PatternMatching = exports.ExplicitSubstitution = exports.FileImport = exports.PrecisionDeclaration = exports.PatternDefinition = exports.Definition = exports.IdentifierDeclaration = exports.Identifier = exports.Environment = exports.Program = exports.BaseNode = void 0;
exports.CommentBlock = exports.CommentLine = exports.LambdaExpression = exports.ForeignVariable = exports.ForeignConstant = exports.ForeignFunction = exports.Route = exports.Waveform = exports.OutputsCall = exports.InputsCall = exports.AccessExpression = void 0;
class BaseNode {
    constructor(location) {
        this.location = location;
        this.scope = null;
        this.scopeStack = [];
        this.insN = null;
        this.outsN = null;
    }
    process(enter, exit) {
        enter(this);
        Object.keys(this)
            .forEach(key => {
            // @ts-ignore
            if (this[key] instanceof BaseNode) {
                // @ts-ignore
                this[key].process(enter);
            }
            // @ts-ignore
            if (Array.isArray(this[key])) {
                //@ts-ignore
                this[key].forEach(n => {
                    if (n instanceof BaseNode) {
                        n.process(enter);
                    }
                });
            }
        });
        if (exit) {
            exit(this);
        }
    }
}
exports.BaseNode = BaseNode;
BaseNode.type = 'BaseNode';
class Program extends BaseNode {
    constructor(body, location) {
        super(location);
        this.body = body;
        this.comments = [];
    }
}
exports.Program = Program;
Program.type = 'Program';
class Environment extends BaseNode {
    constructor(body, location) {
        super(location);
        this.body = body;
    }
}
exports.Environment = Environment;
Environment.type = 'Environment';
class Identifier extends BaseNode {
    constructor(name, location) {
        super(location);
        this.name = name;
    }
}
exports.Identifier = Identifier;
Identifier.type = 'Identifier';
class IdentifierDeclaration extends BaseNode {
    constructor(name, location) {
        super(location);
        this.name = name;
    }
}
exports.IdentifierDeclaration = IdentifierDeclaration;
IdentifierDeclaration.type = 'IdentifierDeclaration';
class Definition extends BaseNode {
    constructor(id, args, recursive, expression, location) {
        super(location);
        this.id = id;
        this.args = args;
        this.recursive = recursive;
        this.expression = expression;
    }
}
exports.Definition = Definition;
Definition.type = 'Definition';
class PatternDefinition extends BaseNode {
    constructor(id, args, recursive, expression, location) {
        super(location);
        this.id = id;
        this.args = args;
        this.recursive = recursive;
        this.expression = expression;
    }
}
exports.PatternDefinition = PatternDefinition;
PatternDefinition.type = 'PatternDefinition';
class PrecisionDeclaration extends BaseNode {
    constructor(precision, declaration, location) {
        super(location);
        this.precision = precision;
        this.declaration = declaration;
    }
}
exports.PrecisionDeclaration = PrecisionDeclaration;
PrecisionDeclaration.type = 'PrecisionDeclaration';
class FileImport extends BaseNode {
    constructor(source, location) {
        super(location);
        this.source = source;
    }
}
exports.FileImport = FileImport;
FileImport.type = 'FileImport';
class ExplicitSubstitution extends BaseNode {
    constructor(substitutions, expression, location) {
        super(location);
        this.substitutions = substitutions;
        this.expression = expression;
    }
}
exports.ExplicitSubstitution = ExplicitSubstitution;
ExplicitSubstitution.type = "ExplicitSubstitution";
class PatternMatching extends BaseNode {
    constructor(patterns, location) {
        super(location);
        this.patterns = patterns;
    }
}
exports.PatternMatching = PatternMatching;
PatternMatching.type = "PatternMatching";
class Pattern extends BaseNode {
    constructor(args, expression, location) {
        super(location);
        this.args = args;
        this.expression = expression;
    }
}
exports.Pattern = Pattern;
Pattern.type = "Pattern";
class Import extends FileImport {
}
exports.Import = Import;
Import.type = 'Import';
class Component extends FileImport {
}
exports.Component = Component;
Component.type = 'Component';
class Library extends FileImport {
}
exports.Library = Library;
Library.type = 'Library';
class Declare extends BaseNode {
    constructor(fnName, name, value, location) {
        super(location);
        this.fnName = fnName;
        this.name = name;
        this.value = value;
    }
}
exports.Declare = Declare;
Declare.type = 'Declare';
class CompositionExpression extends BaseNode {
    constructor(operator, left, right, location) {
        super(location);
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}
exports.CompositionExpression = CompositionExpression;
CompositionExpression.type = 'CompositionExpression';
class WithExpression extends BaseNode {
    constructor(expression, context, location) {
        super(location);
        this.expression = expression;
        this.context = context;
    }
}
exports.WithExpression = WithExpression;
WithExpression.type = 'WithExpression';
class LetrecExpression extends BaseNode {
    constructor(expression, context, location) {
        super(location);
        this.expression = expression;
        this.context = context;
    }
}
exports.LetrecExpression = LetrecExpression;
LetrecExpression.type = 'LetrecExpression';
class BinaryExpression extends BaseNode {
    constructor(operator, left, right, location) {
        super(location);
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}
exports.BinaryExpression = BinaryExpression;
BinaryExpression.type = 'BinaryExpression';
class ApplicationExpression extends BaseNode {
    constructor(args, callee, location) {
        super(location);
        this.args = args;
        this.callee = callee;
    }
}
exports.ApplicationExpression = ApplicationExpression;
ApplicationExpression.type = 'ApplicationExpression';
class Primitive extends BaseNode {
}
exports.Primitive = Primitive;
class NumberPrimitive extends Primitive {
    constructor(value, location) {
        super(location);
        this.value = value;
        this.location = location;
    }
}
exports.NumberPrimitive = NumberPrimitive;
NumberPrimitive.type = 'NumberPrimitive';
class WirePrimitive extends Primitive {
}
exports.WirePrimitive = WirePrimitive;
WirePrimitive.type = 'WirePrimitive';
class CutPrimitive extends Primitive {
}
exports.CutPrimitive = CutPrimitive;
CutPrimitive.type = 'CutPrimitive';
class BroadPrimitive extends Primitive {
    constructor(primitive, location) {
        super(location);
        this.primitive = primitive;
    }
}
exports.BroadPrimitive = BroadPrimitive;
BroadPrimitive.type = 'BroadPrimitive';
class UnaryExpression extends BaseNode {
    constructor(operator, argument, location) {
        super(location);
        this.operator = operator;
        this.argument = argument;
    }
}
exports.UnaryExpression = UnaryExpression;
UnaryExpression.type = 'UnaryExpression';
class PostfixDelayExpression extends BaseNode {
    constructor(expression, location) {
        super(location);
        this.expression = expression;
    }
}
exports.PostfixDelayExpression = PostfixDelayExpression;
PostfixDelayExpression.type = 'PostfixDelayExpression';
class Control extends Primitive {
    constructor(label, location) {
        super(location);
        this.label = label;
        // TODO: Parse label metadata here
    }
}
exports.Control = Control;
class InputControl extends Control {
}
exports.InputControl = InputControl;
class OutputControl extends Control {
}
exports.OutputControl = OutputControl;
class ButtonControl extends InputControl {
}
exports.ButtonControl = ButtonControl;
ButtonControl.type = 'ButtonControl';
class CheckboxControl extends InputControl {
}
exports.CheckboxControl = CheckboxControl;
CheckboxControl.type = 'CheckboxControl';
class NumericInputControl extends InputControl {
    constructor(label, initialValue, min, max, step, location) {
        super(label, location);
        this.label = label;
        this.initialValue = initialValue;
        this.min = min;
        this.max = max;
        this.step = step;
        this.controlType = 'Unknown';
    }
}
exports.NumericInputControl = NumericInputControl;
NumericInputControl.type = 'NumericInputControl';
class GroupControl extends Control {
    constructor(label, content, location) {
        super(label, location);
        this.label = label;
        this.content = content;
        this.groupType = 'unknown';
    }
}
exports.GroupControl = GroupControl;
GroupControl.type = 'GroupControl';
class VGroupControl extends GroupControl {
    constructor() {
        super(...arguments);
        this.groupType = 'vgroup';
    }
}
exports.VGroupControl = VGroupControl;
VGroupControl.type = 'VGroupControl';
class HGroupControl extends GroupControl {
    constructor() {
        super(...arguments);
        this.groupType = 'hgroup';
    }
}
exports.HGroupControl = HGroupControl;
HGroupControl.type = 'HGroupControl';
class TGroupControl extends GroupControl {
    constructor() {
        super(...arguments);
        this.groupType = 'tgroup';
    }
}
exports.TGroupControl = TGroupControl;
TGroupControl.type = 'TGroupControl';
class VsliderControl extends NumericInputControl {
    constructor() {
        super(...arguments);
        this.controlType = 'vslider';
    }
}
exports.VsliderControl = VsliderControl;
VsliderControl.type = 'VsliderControl';
class HsliderControl extends NumericInputControl {
    constructor() {
        super(...arguments);
        this.controlType = 'hslider';
    }
}
exports.HsliderControl = HsliderControl;
HsliderControl.type = 'HsliderControl';
class NentryControl extends NumericInputControl {
    constructor() {
        super(...arguments);
        this.controlType = 'nentry';
    }
}
exports.NentryControl = NentryControl;
NentryControl.type = 'NentryControl';
class BargraphControl extends OutputControl {
    constructor(label, min, max, location) {
        super(label, location);
        this.label = label;
        this.min = min;
        this.max = max;
        this.controlType = 'unknown';
    }
}
exports.BargraphControl = BargraphControl;
BargraphControl.type = 'BargraphControl';
class VbargraphControl extends BargraphControl {
    constructor() {
        super(...arguments);
        this.controlType = 'vbargraph';
    }
}
exports.VbargraphControl = VbargraphControl;
VbargraphControl.type = 'HBargraphControl';
class HbargraphControl extends BargraphControl {
    constructor() {
        super(...arguments);
        this.controlType = 'vbargraph';
    }
}
exports.HbargraphControl = HbargraphControl;
HbargraphControl.type = 'HBargraphControl';
class Soundfile extends BaseNode {
    constructor(label, outs, location) {
        super(location);
        this.label = label;
        this.outs = outs;
    }
}
exports.Soundfile = Soundfile;
Soundfile.type = 'Soundfile';
class IterativeExpression extends BaseNode {
    constructor(counter, iterations, expression, location) {
        super(location);
        this.counter = counter;
        this.iterations = iterations;
        this.expression = expression;
        this.operator = 'unknown';
    }
}
exports.IterativeExpression = IterativeExpression;
IterativeExpression.type = 'IterativeExpression';
class ParIteration extends IterativeExpression {
    constructor() {
        super(...arguments);
        this.operator = 'par';
    }
}
exports.ParIteration = ParIteration;
ParIteration.type = 'ParIteration';
class SumIteration extends IterativeExpression {
    constructor() {
        super(...arguments);
        this.operator = 'sum';
    }
}
exports.SumIteration = SumIteration;
SumIteration.type = 'SumIteration';
class SeqIteration extends IterativeExpression {
    constructor() {
        super(...arguments);
        this.operator = 'seq';
    }
}
exports.SeqIteration = SeqIteration;
SeqIteration.type = 'SeqIteration';
class ProdIteration extends IterativeExpression {
    constructor() {
        super(...arguments);
        this.operator = 'prod';
    }
}
exports.ProdIteration = ProdIteration;
ProdIteration.type = 'ProdIteration';
class AccessExpression extends BaseNode {
    constructor(environment, property, location) {
        super(location);
        this.environment = environment;
        this.property = property;
    }
}
exports.AccessExpression = AccessExpression;
AccessExpression.type = 'AccessExpression';
class InputsCall extends BaseNode {
    constructor(expression, location) {
        super(location);
        this.expression = expression;
    }
}
exports.InputsCall = InputsCall;
InputsCall.type = 'InputsCall';
class OutputsCall extends BaseNode {
    constructor(expression, location) {
        super(location);
        this.expression = expression;
    }
}
exports.OutputsCall = OutputsCall;
OutputsCall.type = 'OutputsCall';
class Waveform extends BaseNode {
    constructor(values, location) {
        super(location);
        this.values = values;
    }
}
exports.Waveform = Waveform;
Waveform.type = 'Waveform';
class Route extends BaseNode {
    constructor(ins, outs, pairs, location) {
        super(location);
        this.ins = ins;
        this.outs = outs;
        this.pairs = pairs;
    }
}
exports.Route = Route;
Route.type = "Route";
class ForeignFunction extends BaseNode {
    constructor(fnType, signature, types, headerFile, str, location) {
        super(location);
        this.fnType = fnType;
        this.signature = signature;
        this.types = types;
        this.headerFile = headerFile;
        this.str = str;
    }
}
exports.ForeignFunction = ForeignFunction;
ForeignFunction.type = "ForeignFunction";
class ForeignConstant extends BaseNode {
    constructor(ctype, name, str, location) {
        super(location);
        this.ctype = ctype;
        this.name = name;
        this.str = str;
    }
}
exports.ForeignConstant = ForeignConstant;
ForeignConstant.type = "ForeignConstant";
class ForeignVariable extends BaseNode {
    constructor(ctype, name, str, location) {
        super(location);
        this.ctype = ctype;
        this.name = name;
        this.str = str;
    }
}
exports.ForeignVariable = ForeignVariable;
ForeignVariable.type = "ForeignVariable";
class LambdaExpression extends BaseNode {
    constructor(params, expression, location) {
        super(location);
        this.params = params;
        this.expression = expression;
    }
}
exports.LambdaExpression = LambdaExpression;
LambdaExpression.type = "LambdaExpression";
// Comments are not actually nodes, but they share the same interface
class CommentLine extends BaseNode {
    constructor(text, location) {
        super(location);
        this.text = text;
    }
}
exports.CommentLine = CommentLine;
CommentLine.type = "CommentLine";
class CommentBlock extends BaseNode {
    constructor(text, location) {
        super(location);
        this.text = text;
    }
}
exports.CommentBlock = CommentBlock;
CommentBlock.type = "CommentBlock";

import MonoFactory = Faust.MonoFactory;
import Compiler = Faust.Compiler;
import FaustMonoNode = Faust.FaustMonoNode;
import LibFaust = Faust.LibFaust;
import SVGDiagrams = Faust.SVGDiagrams;
import {BehaviorSubject} from "rxjs";
import {editorStore} from "./editor.store";
import {StaticScope} from "../scope/StaticScope";
import {Analyser} from "../scope/analyser";

declare const FaustModule: Faust.FaustModule;

const audioCtx = new window.AudioContext();
const outputAnalyser = audioCtx.createAnalyser();


const styleDiagram = (diagram: string) => {
  return diagram.replaceAll("\n", "").replace(/<style>.*<\/style>/, `<style>
.arrow {stroke:#AFB1B3; stroke-width:0.25; fill:none}
.line  {stroke:#AFB1B3; stroke-linecap:round; stroke-width:0.25;}
.dashline {stroke:#AFB1B3; stroke-linecap:round; stroke-width:0.25; stroke-dasharray:3,3;}
.text  {font-family:Arial; font-size:7px; text-anchor:middle; fill:#AFB1B3;}
.label {font-family:Arial; font-size:7px; fill:#AFB1B3}
.error {stroke-width:0.3; fill:red; text-anchor:middle;}
.reason{stroke-width:0.3; fill:none; text-anchor:middle;}
.carre {stroke:black; stroke-width:0.5; fill:none;}
.shadow{stroke:none; fill:#aaaaaa; filter:url(#filter);}
.rect  {stroke:none; fill:#cccccc;}
.border {stroke:none; fill:none;}
.linkbox {stroke:none; fill:#284869;}
.normalbox {stroke:none; fill:#525861;}
.uibox {stroke:none; fill:#3a694e;}
.slotbox {stroke:none; fill:#47945E;}
.numcolorbox {stroke:none; fill:#753c07;}
.invcolorbox {stroke:none; fill:#2b2b2b;}
.link:hover { cursor:pointer;}
</style>`);
}

class FaustStore {
  public onCodeChanged = new BehaviorSubject(`import("stdfaust.lib");
process = ba.pulsen(1, 10000) : pm.djembe(60, 0.3, 0.4, 1) <: dm.freeverb_demo;`);

  private libFaust: LibFaust | null = null;

  private faustFactory: MonoFactory | null = null;
  private faustCompiler: Compiler | null = null;
  private faustDiagrams: SVGDiagrams | null = null;

  private node: FaustMonoNode | null = null;

  public onDiagramChanged = new BehaviorSubject('');

  public onRunningChanged = new BehaviorSubject(false);

  private plot: StaticScope | null = null;
  private analyser: Analyser | null = null;

  constructor() {
    FaustModule().then((module: any) => {
      const libFaust = Faust.createLibFaust(module);
      if (!libFaust) {
        return;
      }

      this.libFaust = libFaust;

      this.faustCompiler = Faust.createCompiler(libFaust);
      this.faustFactory = Faust.createMonoFactory();
    });
  }

  setCode(code: string) {
    this.onCodeChanged.next(code);
  }

  compile(code: string) {
    if (!this.plot) {
      this.plot = new StaticScope({container: document.querySelector("#plot-ui")!});
      // outputAnalyser.drawHandler =
      this.analyser = new Analyser(16, "continuous");
      this.analyser.drawHandler = this.plot.draw;
      this.analyser.getSampleRate = () => audioCtx.sampleRate;
      this.analyser.drawMode = 'continuous';
      this.analyser.fftSize = 256;
      this.analyser.fftOverlap = 2;
    }

    if (!this.faustFactory || !this.faustCompiler || !this.libFaust) {
      return null;
    }

    const diagrams = Faust.createSVGDiagrams(this.libFaust, "diagram", code, "");
    if (!diagrams.success()) {
      const error = diagrams.error();
      editorStore.showError(error);
      return;
    } else {
      editorStore.hideError();
      this.faustDiagrams = diagrams;
    }

    const diagram = diagrams.getSVG();

    console.log(diagram);

    const restyledDiagram = styleDiagram(diagram);

    this.onDiagramChanged.next(restyledDiagram);

    console.log(`Faust compiler version: ${this.faustCompiler.version()}`);

    this.faustFactory.compileNode(audioCtx, "Faust", this.faustCompiler, code, "-ftz 2", false, 128).then(node => {
      if (!node) {
        return;
      }

      audioCtx.resume();

      this.node?.disconnect();

      this.node = node;
      this.node.connect(outputAnalyser);

      outputAnalyser.connect(audioCtx.destination);
      this.onRunningChanged.next(true);
    });

  }

  stop() {
    if (!this.node) {
      return;
    }

    this.node.disconnect();
    this.onRunningChanged.next(false);
  }

  run() {
    this.compile(this.onCodeChanged.getValue());
  }

  loadDiagram(name: string) {
    if (!this.faustDiagrams) {
      return;
    }

    this.onDiagramChanged.next(styleDiagram(this.faustDiagrams.getSVG(name)));
  }
}

export const faustStore = new FaustStore();

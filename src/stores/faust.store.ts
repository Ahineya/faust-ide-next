import {BehaviorSubject} from "rxjs";
import {editorStore} from "./editor.store";
import {StaticScope} from "../scope/StaticScope";
import {Analyser} from "../scope/analyser";

// @ts-ignore
import {Faust} from "faust2webaudio/dist/index.min.js";

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
process = ba.pulsen(1, 10000) : pm.elecGuitar(3, 0.8, 1, 0.5) <: dm.freeverb_demo;
//process = ba.pulsen(1, 10000) : pm.djembe(60, 0.3, 0.4, 1) <: dm.freeverb_demo;`);

  private node: any;// FaustAudioWorkletNode & AudioWorkletNode | null = null;

  public onDiagramChanged = new BehaviorSubject('');

  public onRunningChanged = new BehaviorSubject(false);

  private plot: StaticScope | null = null;
  private analyser: Analyser | null = null;

  private faust: Promise<Faust>;

  private audioContext: AudioContext | null = null;

  constructor() {
    this.faust = new Faust({
      wasmLocation: '/faust/libfaust-wasm.wasm',
      dataLocation: '/faust/libfaust-wasm.data',
    }).ready;
  }

  getFaust() {
    return this.faust;
  }

  setCode(code: string) {
    this.onCodeChanged.next(code);
  }

  compile(code: string) {
    // Check if plot is opened

    if (!this.audioContext) {
      this.audioContext = new window.AudioContext();
    }

    if (!this.plot) {
      this.plot = new StaticScope({container: document.querySelector("#plot-ui")!});
      this.analyser = new Analyser(16, "continuous");
      this.analyser.drawHandler = this.plot.draw;
      this.analyser.getSampleRate = () => this.audioContext!.sampleRate;
      this.analyser.drawMode = 'continuous';
      this.analyser.fftSize = 256;
      this.analyser.fftOverlap = 2;
    }

    this.faust.then(faust => {
      editorStore.hideError();

      try {
        const diagram = faust.getDiagram(code, {"-I": ["libraries/", "project/"]});
        this.onDiagramChanged.next(diagram);
      } catch (e) {
        editorStore.showError(e.message);
        return;
      }

      faust.getNode(code, { audioCtx: this.audioContext, useWorklet: true, bufferSize: 128, voices: 1, args: {"-I": ["libraries/", "project/"]}, plotHandler: this.analyser!.plotHandler})
      // faust.getNode(code, { audioCtx, useWorklet: true, bufferSize: 128, voices: 1, args: {"-I": ["libraries/", "project/"]}, plotHandler: () => {}})
        .then((node: any) => {
          if (!node) {
            return;
          }
          console.log(node);

          this.node = node as any;//FaustAudioWorkletNode & AudioWorkletNode;
          this.node.connect(this.audioContext!.destination);
          this.onRunningChanged.next(true);
        })
    });
  }

  stop() {
    if (!this.node) {
      return;
    }

    this.node.disconnect();
    this.node.destroy();
    this.onRunningChanged.next(false);
  }

  run() {
    this.compile(this.onCodeChanged.getValue());
  }

  loadDiagram(name: string) {
    this.getFaust()
      .then(faust => {
        const diagram = faust.fs.readFile(`/FaustDSP-svg/${name}`, { encoding: "utf8" }) as string;
        this.onDiagramChanged.next(diagram);
      });
  }
}

export const faustStore = new FaustStore();

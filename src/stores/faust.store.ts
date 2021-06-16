import {BehaviorSubject} from "rxjs";
import {editorStore} from "./editor.store";

// @ts-ignore
import {Faust} from "faust2webaudio/dist/index.min.js";
import {plotStore} from "./plot.store";
import {uiStore} from "./ui.store";
import {mephisto} from "../services/mephisto.service";

class FaustStore {
  public onCodeChanged = new BehaviorSubject(`
import("stdfaust.lib");
a(x) = x + 1;

process = a(1);
`);

  private node: any;// FaustAudioWorkletNode & AudioWorkletNode | null = null;

  public onDiagramChanged = new BehaviorSubject('');
  public onRunningChanged = new BehaviorSubject(false);

  private faust: Promise<Faust>;
  private audioContext: AudioContext | null = null;

  constructor() {
    this.faust = new Faust({
      wasmLocation: '/faust/libfaust-wasm.wasm',
      dataLocation: '/faust/libfaust-wasm.data',
    }).ready;

    this.faust.then(f => {
      (window as any)._faust = f;
    });

    const item = localStorage.getItem('code') || `import("stdfaust.lib");
a(x) = x + 1;

process = a(1);`;

    this.onCodeChanged.next(item);
  }

  getFaust() {
    return this.faust;
  }

  setCode(code: string) {
    this.onCodeChanged.next(code);
    localStorage.setItem('code', code);

    mephisto.debouncedParseFaustCode(code);
  }

  compile(code: string) {
    if (!this.audioContext) {
      this.audioContext = new window.AudioContext();
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

      faust.getNode(code, {
        audioCtx: this.audioContext,
        useWorklet: true,
        bufferSize: 128,
        voices: 0,
        args: {"-I": ["libraries/", "project/"]},
        plotHandler: plotStore.getAnalyserPlotHandler()
      })
        .then((node: any) => {
          if (!node) {
            return;
          }
          this.node = node as any;//FaustAudioWorkletNode & AudioWorkletNode;
          this.node.connect(this.audioContext!.destination);

          console.log(node);
          (window as any).MYDSP = node;

          const paramsObject: { [key: string]: number } = {};
          const params = node.getParams().reduce((acc: typeof paramsObject, curr: string) => {
            acc[curr] = node.getParamValue(curr);
            return acc;
          }, paramsObject);

          console.log(params);

          uiStore.setUI(node.getUI(), paramsObject);

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
        const diagram = faust.fs.readFile(`/FaustDSP-svg/${name}`, {encoding: "utf8"}) as string;
        this.onDiagramChanged.next(diagram);
      });
  }

  setParamValue(address: string, value: number) {
    if (!this.node) {
      return;
    }

    this.node.setParamValue(address, value);
    uiStore.setParamValue(address, value);
  }
}

export const faustStore = new FaustStore();

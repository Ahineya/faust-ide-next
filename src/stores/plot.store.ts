import {EScopeMode, StaticScope} from "../scope/StaticScope";
import {Analyser} from "../scope/analyser";

type AnalyzerDrawMode = "offline" | "continuous" | "onevent" | "manual";

class PlotStore {

  private containerElement: HTMLDivElement | null = null;

  private analyser: Analyser;
  private plot: StaticScope | null = null;

  private lastPlotMode: EScopeMode = EScopeMode.Oscilloscope;
  private lastAnalyzerDrawMode: AnalyzerDrawMode = "continuous";

  constructor() {
    this.analyser = new Analyser(16, "offline");
    this.analyser.getSampleRate = () => 44100;//this.audioContext!.sampleRate;
    this.analyser.fftSize = 256;
    this.analyser.fftOverlap = 2;
  }

  public setPlotElementVisible(containerElement: HTMLDivElement) {
    this.containerElement = containerElement;

    this.plot = new StaticScope({container: this.containerElement});
    this.analyser.drawHandler = this.plot.draw;

    this.setAnalyzerDrawMode(this.lastAnalyzerDrawMode);
    this.setPlotMode(this.lastPlotMode);
  }

  public setPlotElementHidden() {
    this.containerElement = null;
    this.analyser.drawMode = 'offline';
  }

  public getAnalyserPlotHandler() {
    return this.analyser.plotHandler;
  }

  public drawCurrent() {
    if (this.plot && this.lastPlotMode !== EScopeMode.Data) {
      this.plot.draw();
    }
  }

  private setAnalyzerDrawMode(drawMode: AnalyzerDrawMode) {
    this.lastAnalyzerDrawMode = drawMode;
    this.analyser.drawMode = drawMode;
  }

  private setPlotMode(plotMode: EScopeMode) {
    if (!this.plot) {
      return;
    }

    this.lastPlotMode = plotMode;
    this.plot.mode = plotMode;
  }

  public showSpectroscope() {
    if (!this.plot) {
      return;
    }

    this.setPlotMode(EScopeMode.Spectroscope);
    this.setAnalyzerDrawMode("continuous");
  }

  public showOscilloscope() {
    if (!this.plot) {
      return;
    }

    this.setPlotMode(EScopeMode.Oscilloscope);
    this.setAnalyzerDrawMode("continuous");
  }

  public showInterleaved() {
    if (!this.plot) {
      return;
    }

    this.setPlotMode(EScopeMode.Interleaved);
    this.setAnalyzerDrawMode("continuous");
  }

  public showData() {
    if (!this.plot) {
      return;
    }

    this.setAnalyzerDrawMode("offline");
    this.setPlotMode(EScopeMode.Data);
  }
}

export const plotStore = new PlotStore();

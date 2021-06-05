import {BehaviorSubject} from "rxjs";
import {editorStore} from "./editor.store";
import {StaticScope} from "../scope/StaticScope";
import {Analyser} from "../scope/analyser";

// @ts-ignore
import {Faust} from "faust2webaudio/dist/index.min.js";
import {plotStore} from "./plot.store";
import {uiStore} from "./ui.store";

class FaustStore {
  public onCodeChanged = new BehaviorSubject(`declare name \t\t"synth";
declare version \t"1.0";
declare author \t\t"Pavlo";
declare license \t"MIT";
declare copyright \t"(c)Pavlo 2020";

declare options "[midi:on]";

import("stdfaust.lib");

process = signal : FILTER : HP_FILTER: * (ADSR) * (lfoGainMod) * GLOBAL_GAIN : DISTORTION : ECHO : REVERB : _, _;

signal = osc1, osc2 : drywetmixer(oscBalance * balanceMod) + NOISE;

GLOBAL_GAIN = (synthg(vslider("[3]gain", 0.5, 0, 1, 0.01) : si.smoo));

// BEGIN oscillators
freq = osc1g(vslider("freq [style: knob]", 220, 31, 3952, 0.01));
osc1waveform = osc1g(vslider("osc1Waveform [style: knob]", 0, 0, 3, 1));
osc1pw = osc1g(vslider("osc1pw [style: knob]", 0, -1, 1, 0.01): si.smoo);
osc1 = osc1Wave(osc1modulatedFrequency, osc1waveform);

detune = osc2g(vslider("osc2Detune [style: knob]", 0, -1, 1, 0.01));
octaveOffset = osc2g(vslider("osc2OctaveOffset [style: knob]", 2, 0, 4, 0.01));
osc2semiOffset = osc2g(vslider("osc2SemiOffset [style: knob]", 0, -7, 7, 1));

SEMI = pow(2, 1/12);
semiOffset(freq, semi) = freq * pow(SEMI, semi);

osc2frequency = (semiOffset(freq * octaveOffset, osc2semiOffset)) + detune;

osc2waveform = osc2g(vslider("osc2Waveform [style: knob]", 2, 0, 3, 1));
osc2disabled = osc2g(checkbox("osc2Disabled"));
osc2 = select2(osc2disabled, osc2Wave(osc2modulatedFrequency, osc2waveform), 0);

osc1modulatedFrequency = lfoFreqMod(freq * freqMod);
osc2modulatedFrequency = lfoFreqMod(osc2frequency * freqMod);

freqMod = ADSR : amountMul(toFreq);

balanceMod = lfoOscBalanceMod * (ADSR : amountMul(toOscBalance));
oscBalance = oscillatorsg(vslider("[1] oscBalance [style: knob]", 0.5, 0, 1, 0.01): si.smoo);

oscsin(freq) = osc_sin_sync(freq, gate);
osctri(freq) = osc_tri_sync(freq, gate);
oscsqu(freq) = pwmpulse(freq, lfoPWMMod);

osc1squ(freq) = pwmpulse(freq, ((osc1pw + lfoPWMMod) : max(-0.9) : min(0.9)));
osc2squ(freq) = pwmpulse(freq, (lfoPWMMod : max(-0.9) : min(0.9)));

oscsaw(freq) = osc_saw_sync(freq, gate);

// oscWave(freq, waveSelector) = ba.selectn(4, waveSelector, oscsin(freq),osctri(freq),oscsaw(freq),oscsqu(freq));
osc1Wave(freq, waveSelector) = ba.selectn(4, waveSelector, oscsin(freq),osctri(freq),oscsaw(freq),osc1squ(freq));
osc2Wave(freq, waveSelector) = ba.selectn(4, waveSelector, oscsin(freq),osctri(freq),oscsaw(freq),osc2squ(freq));
// END oscillators

// BEGIN noise
noiseAmount = noiseg(vslider("noiseAmount [style:knob]", 0, 0, 1, 0.01) : si.smoo);
NOISE = no.noise * noiseAmount * lfoNoiseMod;
// END noise

// BEGIN filter
lpCutoff = filterg(vslider("[0]filterCutoff [style:knob] [scale:exp]", 22000, 40, 22000, 0.01): si.smoo);
lpResonance = filterg(vslider("[1]filterResonance [style:knob]", 0.5, 0.01, 25, 0.01): si.smoo);

hpCutoff = filterg(vslider("[2]hpFilterCutoff [style:knob] [scale:exp]", 1, 1, 22000, 0.01));

FILTER = fi.resonlp(lpCutoff * cutoffMod : min(22000), lpResonance, 1);

cutoffMod = lfoCutoffMod(ADSR : amountMul(toFilterCutoff));

HP_FILTER = _ <: _, fi.highpass(2, hpCutoff) : select2(filterg(checkbox("LPF Enable")));
// END filter

// BEGIN envelope
attack = adsrg(vslider("[0]adsrAttack", 0.3, 0, 5, 0.01): si.smoo);
decay = adsrg(vslider("[1]adsrDecay", 0.01, 0, 5, 0.01): si.smoo);
sustain = adsrg(vslider("[2]adsrSustain", 1, 0, 1, 0.01): si.smoo);
release = adsrg(vslider("[3]adsrRelease", 0.01, 0, 5, 0.01): si.smoo);

toFreq = envelopesendg(vslider("[0] adsr To Osc Freq [style:knob]", 0, -1, 1, 0.01) : si.smoo);
toFilterCutoff = envelopesendg(vslider("[1] adsr to Filt Cutoff [style:knob]", 0, 0, 1, 0.01) : si.smoo);
toNoiseAmount = envelopesendg(vslider("[2] adsr to Noise Amount [style:knob]", 0, 0, 1, 0.01) : si.smoo);
toOscBalance = envelopesendg(vslider("[3] adsr to osc balance [style:knob]", 0, -1, 1, 0.01) : si.smoo);

ADSR = en.adsre(attack, decay, sustain, release, gate);//: si.smooth(0.9);
// END envelope

// BEGIN lfo
lfoWaveform = lfog(vslider("[1] lfoWaveform [style: knob]", 0, 0, 3, 1));
lfoFreq = lfog(vslider("[0] lfoFrequency [style: knob]", 1, 0, 220, 0.01): si.smoo);

lfoToOscFreqAmount = lfosendg(vslider("[0] lfo to Osc Freq [style: knob]", 0, 0, 1, 0.01): si.smoo);
lfoToOscGainAmount = lfosendg(vslider("[1] lfo to Gain [style: knob]", 0, 0, 1, 0.01): si.smoo);
lfoToFilterCutoffAmount = lfosendg(vslider("[2] lfo to Filt Cutoff [style: knob]", 0, 0, 1, 0.01): si.smoo);
lfoToNoiseAmount = lfosendg(vslider("[3] lfo to Noise Amount [style: knob]", 0, 0, 1, 0.01): si.smoo);
lfoToPWM = lfosendg(vslider("[4] lfo to PWM [style: knob]", 0, 0, 1, 0.01): si.smoo);
lfoToOscBalance = lfosendg(vslider("[5] lfo to OSC Bal [style: knob]", 0, 0, 1, 0.01): si.smoo);

lfoWave(freq, waveSelector) = ba.selectn(4, waveSelector, oscsin(freq),osctri(freq),(oscsaw(freq): si.smooth(0.99)),(pwmpulse(freq, 0): si.smooth(0.99)));
lfo = lfoWave(lfoFreq, lfoWaveform);

lfoGainMod = lfo : scalePositive : amountMul(lfoToOscGainAmount);
lfoFreqMod(freq) = freq + (lfo * min(freq * lfoToOscFreqAmount, freq));
lfoCutoffMod(cutoff) = cutoff + (lfo * min(cutoff * lfoToFilterCutoffAmount, cutoff));
lfoNoiseMod = lfo : scalePositive : amountMul(lfoToNoiseAmount);

lfoPWMMod = lfo : amount(lfoToPWM);
lfoOscBalanceMod = lfo : amountMul(lfoToOscBalance);


// END lfo

// BEGIN distortion
distortionDrive = distg(vslider("[0] Drive [style:knob]", 0, 0, 1, 0.01): si.smoo);

distortionSignal = _ <: _, ef.cubicnl(distortionDrive, 0) : select2(distortionDrive > 0);

DISTORTION = distortionSignal;//ef.cubicnl(distortionDrive, 0);

// END distortion

// BEGIN echo

echoDuration = echog(vslider("[0] Duration [style:knob]", 0.5, 0, 1, 0.01): si.smoo);
echoFeedback = echog(vslider("[1] Feedback [style:knob]", 0, 0, 1, 0.01): si.smoo);
ECHO = ef.echo(5, echoDuration, echoFeedback);

// END echo

// BEGIN reverb

REVERB = _ <: _, _, revsig : _, ro.cross(2), _ : drywetmixer(reverbmix), drywetmixer(reverbmix);

revsig = re.zita_rev1_stereo(
    40,
    500,//vslider("[0]f1 [style: knob]", 500, 20, 4000, 0.01) : si.smoo,
    700,//vslider("[1]f2 [style: knob]", 700, 20, 4000, 0.01) : si.smoo,
    120,//vslider("[2]t60dc [style: knob]", 120, 20, 4000, 0.01) : si.smoo,
    reverbg(vslider("[0] Depth [style: knob]", 200, 10, 400, 0.01) : si.smoo),
    2000//vslider("[4]fmax [style: knob]", 2000, 20, 4000, 0.01) : si.smoo
);

reverbmix = reverbg(vslider("[1] Mix [style: knob]", 0, 0, 1, 0.01): si.smoo);
// END reverb

//gate = ba.pulsen(10000, 22000);
gate = button("Gate"): si.smooth(0.001);

// BEGIN helpers
stereo(mono) = mono <: _, _;
drywetmixer(balance) = (_ *(1 - balance), _*(balance)) :> _ ;
amountMul(amount) = 1, _ : drywetmixer(amount);
amount(amount) = _ *(amount);
scalePositive = _ * 0.5 + 0.5;

pwmpulse(freq, duty) = 1, -1 : select2(osc_sin_sync(freq, gate) : > (duty));
// END helpers

// BEGIN fixed ADSR
adsr(at,dt,sl,rt,gate) = ADS : *(1-R) : max(0)
with {

    // Durations in samples
    an = max(1, at*ma.SR);
    dn = max(1, dt*ma.SR);
    rn = max(1, rt*ma.SR);

    // Deltas per samples
    adelta = 1/an;
    ddelta = (1-sl)/dn;


    // Attack time (starts when gate changes and raises until gate == 0)
    atime = +(gate) ~ *(gate' >= gate);

    // Attack curve
    A = atime * adelta;

    // Decay curve
    D0 = 1 + an * ddelta;
    D = D0 - atime * ddelta;

    // ADS part
    ADS = min(A, max(D, sl));

    // Release time starts when gate is 0
    rtime = (+(1) : *(gate == 0)) ~ _;

    // Release curve starts when gate is 0 with the current value of the envelope
    R = rtime/rn;
};
// END Fixed ADSR

phasor(freq, reset) =   d(+(inc)) ~
                        *(1 - clk)
    with {
        clk = (reset - reset') == 1;
        d(x) = x : ma.decimal;
        inc = freq / float(ma.SR);
    };

osc_sin_sync(freq, reset) = sin(phasor(freq, reset) * 2 * ma.PI): si.smooth(0.01);
osc_tri_sync(freq, reset) = abs(phasor(freq, reset) - 0.5) * 4 - 1;
osc_saw_sync(freq, reset) = (phasor(freq, reset) - 0.5) * 2;
osc_pulse(freq, duty, reset) = 1, -1 : select2(osc_sin_sync(freq, reset) : > (duty));

maing(x) = vgroup("",x);
    synthg(x) = maing(hgroup("[0] Synth",x));
        oscillatorsg(x) = synthg(hgroup("[0] Oscillators", x));
            osc1g(x) = oscillatorsg(vgroup("[0] OSC1", x));
                // osc1freq
                // osc1waveform
            // oscbalanceg(x) = oscillatorsg(vgroup("[1] Balance", x));
                // oscBalance
            osc2g(x) = oscillatorsg(vgroup("[2] OSC2", x));
                // osc2freq
                // osc2waveform
            noiseg(x) = oscillatorsg(vgroup("[3] Noise", x));
                // noiseAmount
        filterg(x) = synthg(vgroup("[1] Filter", x));
            // filterCutoff
            // filterResonance
        envelopeg(x) = synthg(hgroup("[2] Envelope", x));
            adsrg(x) = envelopeg(hgroup("[0] ADSR", x));
                // \tattack
                // \tdecay
                // \tsustain
                // \trelease
            envelopesendg(x) = envelopeg(vgroup("[1] Send", x));
                // \ttoOscFreq
                // \ttoFilterCutoff
        lfog(x) = synthg(hgroup("[3] LFO", x));
            //  frequency
            lfosendg(x) = lfog(vgroup("[1] Send", x));

            // \twaveform
            //  toGainAmount
            // \ttoOscFreqAmount
            // \ttoFilterCutoffAmount
        effectsg(x) = synthg(hgroup("[4] Effects", x));
            distg(x) = effectsg(vgroup("[0] Distortion", x));
            echog(x) = effectsg(vgroup("[1] Echo", x));
            reverbg(x) = effectsg(vgroup("[2] Reverb", x));
    gateg(x) = maing(vgroup("[1] Gate", x));
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
  }

  getFaust() {
    return this.faust;
  }

  setCode(code: string) {
    this.onCodeChanged.next(code);
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

          const paramsObject: {[key: string]: number} = {};
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

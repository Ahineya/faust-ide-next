import {BehaviorSubject} from "rxjs";
import {TFaustUI} from "../components/dsp-ui/types";

class UIStore {
  public onUIChanged = new BehaviorSubject<TFaustUI | null>(null);

  public onParamsChanged = new BehaviorSubject<{[key: string]: number}>({});

  public setUI(ui: TFaustUI, params: {[key: string]: number}) {
    console.log(ui);
    this.onUIChanged.next(ui);
    this.onParamsChanged.next({...params});
  }

  public setParamValue(address: string, value: number) {
    this.onParamsChanged.next({
      ...this.onParamsChanged.getValue(),
      [address]: value
    });
  }
}

export const uiStore = new UIStore();

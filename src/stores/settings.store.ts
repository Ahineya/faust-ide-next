import {BehaviorSubject} from "rxjs";

type ValueOf<T> = T[keyof T];

type TEditorSettings = {
  isVimMode: boolean;
}

export interface ISettings {
  editor: TEditorSettings;
}

class SettingsStore {
  public onSettingsChanged: BehaviorSubject<ISettings>;

  constructor() {
    // TODO: Take settings from the persistence

    this.onSettingsChanged = new BehaviorSubject<ISettings>({
      editor: {
        isVimMode: false
      }
    });
  }

  private setEditorSetting(setting: keyof TEditorSettings, value: ValueOf<TEditorSettings>) {
    const settings = JSON.parse(JSON.stringify(this.onSettingsChanged.getValue()));
    settings.editor[setting] = value;
    this.onSettingsChanged.next(settings);
  }

  public setEditorVimMode(isVimMode: boolean) {
    this.setEditorSetting("isVimMode", isVimMode);
  }
}

export const settingsStore = new SettingsStore();

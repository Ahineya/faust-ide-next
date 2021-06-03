import {useEffect, useState} from "react";
import {ISettings, settingsStore} from "../stores/settings.store";

export const useSettings = (settingsSection: keyof ISettings) => {
  const [settings, setSettings] = useState<ISettings>({} as ISettings);

  useEffect(() => {
    const subscriptions = [
      settingsStore.onSettingsChanged.subscribe(settings => {
        setSettings(settings);
      })
    ];

    return () => subscriptions.forEach(s => s.unsubscribe());
  }, []);

  return settings[settingsSection] || null;
}

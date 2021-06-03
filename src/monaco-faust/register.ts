import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import {language, config, theme, getProviders} from "./FaustLang";
import FaustModule = Faust.FaustModule;

export const faustLangRegister = (monacoEditor: typeof monaco, faust: FaustModule) => {
    monacoEditor.languages.register(language);
    monacoEditor.languages.setLanguageConfiguration("faust", config);
    monacoEditor.editor.defineTheme("vs-dark", theme);

    getProviders(faust)
      .then(providers => {
          monacoEditor.languages.registerHoverProvider("faust", providers.hoverProvider);
          monacoEditor.languages.setMonarchTokensProvider("faust", providers.tokensProvider);
          monacoEditor.languages.registerCompletionItemProvider("faust", providers.completionItemProvider);
      });
    // return { providers, faustLang };
};

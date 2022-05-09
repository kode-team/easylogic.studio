import { SUBSCRIBE_SELF, createComponent } from "sapa";

import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class LanguageSelector extends EditorElement {
  get locales() {
    return Object.keys(this.$editor.i18n.locales);
  }

  template() {
    var languages = this.locales.map((lang) => {
      var label = this.$i18n(`app.lang.${lang}`);
      return { text: label, value: lang };
    });

    return /*html*/ `
            <div class='status-selector'>
                <div class='item'>
                    ${createComponent("SelectEditor", {
                      ref: "$locale",
                      options: languages,
                      value: this.$editor.locale,
                      onchange: "changeLocale",
                    })}
                    /> 
                </div>
            </div>
        `;
  }

  [SUBSCRIBE_SELF("changeLocale")](key, locale) {
    this.$command.emit("setLocale", locale);
  }
}

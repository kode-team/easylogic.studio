import { SUBSCRIBE, SUBSCRIBE_SELF } from "el/base/Event";
import { registElement } from "el/base/registElement";

import locales from "../../../i18n/locales";
import { EditorElement } from "../common/EditorElement";

var langs = Object.keys(locales)


export default class LanguageSelector extends EditorElement {
    template () {

        var languages = langs.map(lang => {
            var label = this.$i18n(`app.lang.${lang}`)
            return `${lang}:${label}`
        });

        return /*html*/`
            <div class='status-selector'>
                <label>${this.$i18n('app.label.lang')}</label>
                <div class='item'>
                    <object refClass="SelectEditor"  
                        ref='$locale' 
                        options="${languages.join(',')}" 
                        value="${this.$editor.locale}" 
                        onchange="changeLocale"
                    /> 
                </div>
            </div>
        `

    }

    [SUBSCRIBE_SELF('changeLocale')] (key, locale) {
        this.emit('setLocale', locale);
    }
}

registElement({ LanguageSelector })
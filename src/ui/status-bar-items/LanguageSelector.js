import { registElement } from "@core/registerElement";
import UIElement, { EVENT } from "@core/UIElement";
import "@ui/property-editor";
import locales from "../../i18n/locales";

var langs = Object.keys(locales)


export default class LanguageSelector extends UIElement {
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

    [EVENT('changeLocale')] (key, locale) {
        this.emit('setLocale', locale);
    }
}

registElement({ LanguageSelector })
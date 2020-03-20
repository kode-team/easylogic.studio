import UIElement, { EVENT } from "../../../util/UIElement";
import locales from "../../i18n/locales";
import SelectEditor from "../property-editor/SelectEditor";

var langs = Object.keys(locales)


export default class LanguageSelector extends UIElement {
    components() {
        return {
            SelectEditor
        }
    }
    template () {

        var languages = langs.map(lang => {
            var label = this.$i18n(`app.lang.${lang}`)
            return `${lang}:${label}`
        });

        return /*html*/`
            <div class='language-selector'>
                <label>${this.$i18n('app.label.lang')}</label>
                <div class='item'>
                    <SelectEditor 
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
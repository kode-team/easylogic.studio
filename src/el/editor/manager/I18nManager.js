import { isFunction } from "el/base/functions/func";

export class I18nManager {

    constructor (editor) {
        this.editor = editor;
        this.locales = {};
        this.fallbackLang = 'en_US';
    }

    getLang (lang = undefined) {
        return lang || this.fallbackLang;
    }

    setFallbackLang(lang) {
        this.fallbackLang = lang; 
    }

    get (key, params = {}, lang = undefined) {
        const currentLang = this.getLang(lang);
        const str = this.locales[currentLang]?.[key] || this.locales[this.fallbackLang]?.[key] || key || undefined;

        if(isFunction(str)) {
            return str(params)
        } else {
            let newValue = str; 

            if (key === newValue) {
                return key.split('.').pop();
            } 

            Object.entries(params).forEach(([key, value]) => {
                newValue = newValue.replace(new RegExp(`\{${key}\}`, 'ig'), value);
            })
            return newValue; 
        }
    }

    hasKey (key, lang = undefined) {
        const currentLang = this.getLang(lang);        
        return !!(this.locales[currentLang][key] || this.locales[this.fallbackLang][key]);
    }

    registerI18nMessage (lang, messages) {
        if (!this.locales[lang]) {
            this.locales[lang] = {};
        }

        Object.assign(this.locales[lang], messages);
    }

}
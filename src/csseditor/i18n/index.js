


import { isFunction, keyEach } from '../../util/functions/func';
import locales from './locales';

export const FALLBACK_LANG = 'en_US';

const i18n = {
    locales,
    get (key, params = {}, lang = FALLBACK_LANG) {
        var str = locales[lang][key] || locales[FALLBACK_LANG][key] || undefined;

        if(isFunction(str)) {
            return str(params)
        } else {
            var newValue = str; 
            keyEach(params, (key, value) => {
                newValue = newValue.replace(new RegExp(`\{${key}\}`, 'ig'), value);
            })
            return newValue; 
        }
        
    }
}

export default i18n;
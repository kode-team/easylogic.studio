import UIElement, { EVENT } from "../../../util/UIElement";
import { BIND } from "../../../util/Event";
import locales from "../../i18n/locales";
import { editor } from "../../../editor/editor";
import SelectEditor from "../property-editor/SelectEditor";

var langs = Object.keys(locales)




export default class StatusBar extends UIElement {
    components() {
        return {
            SelectEditor
        }
    }
    template () {

        var languages = langs.map(lang => {
            var label = editor.i18n(`app.lang.${lang}`)
            return `${lang}:${label}`
        });

        return /*html*/`
            <div>
                <div class='message-view' ref='$msg'></div>
                <div class='tool-view' ref='$tool'>
                    <SelectEditor 
                        label='${editor.i18n('app.label.lang')}' 
                        ref='$locale' 
                        options="${languages.join(',')}" 
                        value="${editor.locale}" 
                        onchange="changeLocale"
                    /> 
                </div>
            </div>
        `

    }

    [EVENT('changeLocale')] (key, locale) {
        this.emit('set.locale', locale);
    }

    initState() {
        return {
            msg: '' 
        }
    }

    [BIND('$msg')] () {
        return {
            text: this.state.msg 
        }
    }

    [EVENT('addStatusBarMessage')] (msg) {
        this.setState({ msg })
    } 
}
import { SUBSCRIBE, SUBSCRIBE_SELF } from "el/base/Event";
import { registElement } from "el/base/registElement";

import { EditorElement } from "../common/EditorElement";

const theme_list = ['dark', 'light']

export default class ThemeSwitcher extends EditorElement {

    template () {


        var themes = theme_list.map(theme => {
            var label = this.$i18n(`app.theme.${theme}`)
            return `${theme}:${label}`
        });

        return /*html*/`
            <div class='status-selector'>
                <label>${this.$i18n('app.label.theme')}</label>
                <div class='item'>
                    <object refClass="SelectEditor"  
                        ref='$locale' 
                        options="${themes.join(',')}" 
                        value="${this.$editor.theme}" 
                        onchange="changeItem"
                    /> 
                </div>
            </div>
        `
    }

    [SUBSCRIBE_SELF('changeItem')] (key, theme) {
        this.emit('switchTheme', theme);
    }
}

registElement({ ThemeSwitcher })
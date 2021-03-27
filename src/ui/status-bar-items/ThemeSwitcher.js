import { registElement } from "@sapa/registerElement";
import UIElement, { EVENT } from "@sapa/UIElement";
import "@ui/property-editor";

const theme_list = ['dark', 'light', 'toon', /*, 'gray' */]

export default class ThemeSwitcher extends UIElement {

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

    [EVENT('changeItem')] (key, theme) {
        this.emit('switchTheme', theme);
    }
}

registElement({ ThemeSwitcher })
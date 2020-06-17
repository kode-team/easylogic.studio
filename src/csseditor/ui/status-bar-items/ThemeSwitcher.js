import UIElement, { EVENT } from "../../../util/UIElement";
import SelectEditor from "../property-editor/SelectEditor";

const theme_list = ['dark', 'light', 'toon', /*, 'gray' */]

export default class ThemeSwitcher extends UIElement {
    components() {
        return {
            SelectEditor
        }
    }
    template () {


        var themes = theme_list.map(theme => {
            var label = this.$i18n(`app.theme.${theme}`)
            return `${theme}:${label}`
        });

        return /*html*/`
            <div class='theme-switcher'>
                <label>${this.$i18n('app.label.theme')}</label>
                <div class='item'>
                    <SelectEditor 
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
import UIElement, { EVENT } from "../../../util/UIElement";
import { editor } from "../../../editor/editor";
import SelectEditor from "../property-editor/SelectEditor";

const theme_list = ['dark', 'light'/*, 'gray' */]

export default class ThemeSwitcher extends UIElement {
    components() {
        return {
            SelectEditor
        }
    }
    template () {


        var themes = theme_list.map(theme => {
            var label = editor.i18n(`app.theme.${theme}`)
            return `${theme}:${label}`
        });

        return /*html*/`
            <div class='theme-switcher'>
                <label>${editor.i18n('app.label.theme')}</label>
                <div class='item'>
                    <SelectEditor 
                        ref='$locale' 
                        options="${themes.join(',')}" 
                        value="${editor.theme}" 
                        onchange="changeItem"
                    /> 
                </div>
            </div>
        `
    }

    [EVENT('changeItem')] (key, theme) {
        this.emit('switch.theme', theme);
    }
}
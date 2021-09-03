import { EditorElement } from "el/editor/ui/common/EditorElement";
import { variable } from "el/sapa/functions/registElement";

const theme_list = ['dark', 'light']

export default class ThemeSwitcher extends EditorElement {

    template () {


        var themes = theme_list.map(theme => {
            var label = this.$i18n(`app.theme.${theme}`)
            return {value: theme, text: label }
        });

        return /*html*/`
            <div class='status-selector'>
                <label>${this.$i18n('app.label.theme')}</label>
                <div class='item'>
                    <object refClass="SelectEditor"  
                        ref='$locale' 
                        options=${variable(themes)}
                        value="${this.$editor.theme}" 
                        onchange=${this.subscribe((_, theme) => this.emit('switchTheme', theme))}
                    /> 
                </div>
            </div>
        `
    }
}
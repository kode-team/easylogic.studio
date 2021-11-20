import { SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { variable } from "el/sapa/functions/registElement";

export default class LayoutSelector extends EditorElement {

    template () {

        var layouts = ['all', 'css', 'svg'].map(layout => {
            var label = this.$i18n(`app.layout.${layout}`)
            return { value: layout, text: label }
        });


        return /*html*/`
            <div class='status-selector'>
                <label>${this.$i18n('app.label.layout')}</label>
                <div class='item'>
                    <object refClass="SelectEditor"  
                        ref='$locale' 
                        options=${variable(layouts)}
                        value="${this.$editor.layout}" 
                        onchange="changeEditorLayoutValue"
                    /> 
                </div>
            </div>
        `

    }

    [SUBSCRIBE_SELF('changeEditorLayoutValue')] (key, layout) {
        this.$config.set('editor.layout.mode', layout);
    }
}
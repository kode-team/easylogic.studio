import { SUBSCRIBE, SUBSCRIBE_SELF } from "el/base/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

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
                        options=${this.variable(layouts)}
                        value="${this.$editor.layout}" 
                        onchange="changeEditorLayoutValue"
                    /> 
                </div>
            </div>
        `

    }

    [SUBSCRIBE_SELF('changeEditorLayoutValue')] (key, layout) {
        this.emit('setEditorLayout', layout);
    }
}
import UIElement, { EVENT } from "../../../util/UIElement";
import SelectEditor from "../property-editor/SelectEditor";

export default class LayoutSelector extends UIElement {
    components() {
        return {
            SelectEditor
        }
    }
    template () {

        var layouts = ['all', 'css', 'svg'].map(layout => {
            var label = this.$i18n(`app.layout.${layout}`)
            return `${layout}:${label}`
        });


        return /*html*/`
            <div class='language-selector'>
                <label>${this.$i18n('app.label.layout')}</label>
                <div class='item'>
                    <SelectEditor 
                        ref='$locale' 
                        options="${layouts}" 
                        value="${this.$editor.layout}" 
                        onchange="changeEditorLayoutValue"
                    /> 
                </div>
            </div>
        `

    }

    [EVENT('changeEditorLayoutValue')] (key, layout) {
        this.emit('setEditorLayout', layout);
    }
}
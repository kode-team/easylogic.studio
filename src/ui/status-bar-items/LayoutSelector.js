import { registElement } from "@core/registerElement";
import UIElement, { EVENT } from "@core/UIElement";
import "@ui/property-editor";


export default class LayoutSelector extends UIElement {

    template () {

        var layouts = ['all', 'css', 'svg'].map(layout => {
            var label = this.$i18n(`app.layout.${layout}`)
            return `${layout}:${label}`
        });


        return /*html*/`
            <div class='status-selector'>
                <label>${this.$i18n('app.label.layout')}</label>
                <div class='item'>
                    <object refClass="SelectEditor"  
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

registElement({ LayoutSelector })
import { SUBSCRIBE } from "el/base/Event";
import { registElement } from "el/base/registElement";

import { EditorElement } from "../common/EditorElement";


export default class LayoutSelector extends EditorElement {

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

    [SUBSCRIBE('changeEditorLayoutValue')] (key, layout) {
        this.emit('setEditorLayout', layout);
    }
}

registElement({ LayoutSelector })
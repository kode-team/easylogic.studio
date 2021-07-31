
import { LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { CSS_TO_STRING, STRING_TO_CSS } from "el/utils/func";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './GridLayoutEditor.scss';

export default class GridLayoutEditor extends EditorElement {

    initState() {
        return {
            ...STRING_TO_CSS(this.props.value),
        }
    }

    setValue (value) {
        this.setState({
            ...STRING_TO_CSS(value),
        })
    }

    getValue () {
        return CSS_TO_STRING(this.state)
    }

    modifyData() {
        this.parent.trigger(this.props.onchange, this.props.key, this.getValue())
    }


    template () {
        return /*html*/`
            <div class='elf--grid-layout-editor' ref='$body' ></div>
        `
    }    

    [LOAD('$body')] () {
        return /*html*/`
            <div class='grid-layout-item'>
                <object refClass="GridBoxEditor" 
                    label='${this.$i18n('grid.layout.editor.template.columns')}'
                    ref='$columnBox'
                    key='grid-template-columns'
                    value="${this.state['grid-template-columns'] || ''}"
                    onchange='changeKeyValue'
                />
            </div>
            <div class='grid-layout-item'>
                <object refClass="GridGapEditor" 
                    label='${this.$i18n('grid.layout.editor.column.gap')}'
                    key='grid-column-gap'
                    value="${this.state['grid-column-gap'] || ''}"
                    onchange='changeKeyValue'
                />
            </div>            
            <div class='grid-layout-item'>
                <object refClass="GridBoxEditor" 
                    label='${this.$i18n('grid.layout.editor.template.rows')}'
                    ref='$rowBox'
                    key='grid-template-rows'
                    value="${this.state['grid-template-rows'] || ''}"
                    onchange='changeKeyValue'
                />
            </div>            
            <div class='grid-layout-item'>
                <object refClass="GridGapEditor" 
                    label='${this.$i18n('grid.layout.editor.row.gap')}'                
                    key='grid-row-gap'
                    value="${this.state['grid-row-gap'] || ''}"
                    onchange='changeKeyValue'
                />
            </div>
        `
    }



    [SUBSCRIBE_SELF('changeKeyValue')] (key, value, params) {

        this.setState({
            [key]: value
        }, false)

        this.modifyData();
    }
}
import UIElement, { EVENT } from "@core/UIElement";
import { LOAD } from "@core/Event";
import { CSS_TO_STRING, STRING_TO_CSS } from "@core/functions/func";
import "./SelectIconEditor";
import "./GridBoxEditor";
import "./GridGapEditor";
import { registElement } from "@core/registerElement";

export default class GridLayoutEditor extends UIElement {

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

    template () {
        return /*html*/`
            <div class='grid-layout-editor' ref='$body' ></div>
        `
    }


    [EVENT('changeKeyValue')] (key, value, params) {

        this.setState({
            [key]: value
        }, false)

        this.modifyData();
    }
}

registElement({ GridLayoutEditor })
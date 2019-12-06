import UIElement, { EVENT } from "../../../util/UIElement";
import { LOAD, CLICK } from "../../../util/Event";
import { CSS_TO_STRING, STRING_TO_CSS } from "../../../util/functions/func";
import SelectIconEditor from "./SelectIconEditor";
import { editor } from "../../../editor/editor";
import GridBoxEditor from "./GridBoxEditor";
import GridGapEditor from "./GridGapEditor";

const i18n = editor.initI18n('grid.layout.editor')

export default class GridLayoutEditor extends UIElement {

    components() {
        return {
            SelectIconEditor,
            GridBoxEditor,
            GridGapEditor,
        }
    }

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
                <GridBoxEditor 
                    label='${i18n('template.columns')}'
                    ref='$columnBox'
                    key='grid-template-columns'
                    value="${this.state['grid-template-columns'] || ''}"
                    onchange='changeKeyValue'
                />
            </div>
            <div class='grid-layout-item'>
                <GridGapEditor 
                    label='${i18n('column.gap')}'
                    key='grid-column-gap'
                    value="${this.state['grid-column-gap'] || ''}"
                    onchange='changeKeyValue'
                />
            </div>            
            <div class='grid-layout-item'>
                <GridBoxEditor 
                    label='${i18n('template.rows')}'
                    ref='$rowBox'
                    key='grid-template-rows'
                    value="${this.state['grid-template-rows'] || ''}"
                    onchange='changeKeyValue'
                />
            </div>            
            <div class='grid-layout-item'>
                <GridGapEditor 
                    label='${i18n('row.gap')}'                
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
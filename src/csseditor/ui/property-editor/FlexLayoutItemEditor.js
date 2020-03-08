import UIElement, { EVENT } from "../../../util/UIElement";
import { LOAD } from "../../../util/Event";
import { CSS_TO_STRING, STRING_TO_CSS } from "../../../util/functions/func";
import SelectIconEditor from "./SelectIconEditor";

export default class FlexLayoutItemEditor extends UIElement {

    components() {
        return {
            SelectIconEditor,
        }
    }

    initState() {
        return {
            ...STRING_TO_CSS(this.props.value),
        }
    }

    setValue (value) {
        this.setState(STRING_TO_CSS(value))
    }

    getValue () {
        return CSS_TO_STRING(this.state)
    }

    modifyData() {
        this.parent.trigger(this.props.onchange, this.props.key, this.getValue())
    }

    [LOAD('$body')] () {
        return /*html*/`
            <div class='flex-layout-item'>
                <div class='label'><label>${this.$i18n('flex.layout.item.editor.direction')}</label></div>
                <SelectIconEditor 
                    key='flex-direction'
                    value="${this.state['flex-direction'] || 'row'}"
                    options="${getDirectionOptions()}"
                    onchange='changeKeyValue'
                />
            </div>
            <div class='flex-layout-item'>
                <div class='label'><label>${this.$i18n('flex.layout.item.editor.wrap')}</label></div>
                <SelectIconEditor 
                    key='flex-wrap'
                    value="${this.state['flex-wrap'] || 'wrap'}"
                    options="${getWrapOptions()}"
                    onchange='changeKeyValue'
                />
            </div>
            <div class='flex-layout-item'>
                <div class='label'><label>${this.$i18n('flex.layout.item.editor.justify-content')}</label></div>
                <SelectIconEditor 
                    key='justify-content'
                    value="${this.state['justify-content']}"
                    options="${getJustifyContentOptions()}"
                    onchange='changeKeyValue'
                />
            </div>
            <div class='flex-layout-item'>
                <div class='label'><label>${this.$i18n('flex.layout.item.editor.align-items')}</label></div>
                <SelectIconEditor 
                    key='align-items'
                    value="${this.state['align-items']}"
                    options="${getAlignItemsOptions()}"
                    onchange='changeKeyValue'
                />
            </div>
            <div class='flex-layout-item'>
                <div class='label'><label>${this.$i18n('flex.layout.item.editor.align-content')}</label></div>
                <SelectIconEditor 
                    key='align-content'
                    value="${this.state['align-content']}"
                    options="${getAlignContentOptions()}"
                    onchange='changeKeyValue'
                />
            </div>    
        `
    }

    template () {
        return /*html*/`
            <div class='flex-layout-editor' ref='$body' ></div>
        `
    }


    [EVENT('changeKeyValue')] (key, value, params) {

        this.setState({
            [key]: value
        }, false)

        this.modifyData();
    }
}
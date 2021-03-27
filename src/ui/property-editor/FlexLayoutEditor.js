import UIElement, { EVENT } from "@sapa/UIElement";
import { LOAD } from "@sapa/Event";
import { CSS_TO_STRING, STRING_TO_CSS } from "@sapa/functions/func";
import "./SelectIconEditor";
import { registElement } from "@sapa/registerElement";

export default class FlexLayoutEditor extends UIElement {


    getDirectionOptions () {
        return this.makeOptionsFunction('row,column,row-reverse,column-reverse')
    } 
    
    getWrapOptions () {
        return this.makeOptionsFunction('nowrap,wrap,wrap-reverse')
    }

    getJustifyContentOptions () {
        return this.makeOptionsFunction('flex-start,flex-end,center,space-between,space-around')
    }

    getAlignItemsOptions() {
        return this.makeOptionsFunction('flex-start,flex-end,center,baseline,stretch')
    }

    getAlignContentOptions() {
        return this.makeOptionsFunction('flex-start,flex-end,center,space-between,space-around,stretch')
    }

    makeOptionsFunction (options) {
        return options.split(',').map(it => {
            return `${it}:${this.$i18n('flex.layout.editor.' + it)}`
        }).join(',');
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
            <div class='flex-layout-item'>
                <div class='label'><label>${this.$i18n('flex.layout.editor.direction')}</label></div>
                <object refClass="SelectIconEditor" 
                    key='flex-direction'
                    value="${this.state['flex-direction'] || 'row'}"
                    options="${this.getDirectionOptions()}"
                    onchange='changeKeyValue'
                />
            </div>
            <div class='flex-layout-item'>
                <div class='label'><label>${this.$i18n('flex.layout.editor.wrap')}</label></div>
                <object refClass="SelectIconEditor" 
                    key='flex-wrap'
                    value="${this.state['flex-wrap'] || 'wrap'}"
                    options="${this.getWrapOptions()}"
                    onchange='changeKeyValue'
                />
            </div>
            <div class='flex-layout-item'>
                <div class='label'><label>${this.$i18n('flex.layout.editor.justify-content')}</label></div>
                <object refClass="SelectIconEditor" 
                    key='justify-content'
                    value="${this.state['justify-content'] || 'flex-start'}"
                    options="${this.getJustifyContentOptions()}"
                    onchange='changeKeyValue'
                />
            </div>
            <div class='flex-layout-item'>
                <div class='label'><label>${this.$i18n('flex.layout.editor.align-items')}</label></div>
                <object refClass="SelectIconEditor" 
                    key='align-items'
                    value="${this.state['align-items'] || 'flex-start'}"
                    options="${this.getAlignItemsOptions()}"
                    onchange='changeKeyValue'
                />
            </div>
            <div class='flex-layout-item'>
                <div class='label'><label>${this.$i18n('flex.layout.editor.align-content')}</label></div>
                <object refClass="SelectIconEditor" 
                    key='align-content'
                    value="${this.state['align-content'] || 'flex-start'}"
                    options="${this.getAlignContentOptions()}"
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

registElement({ FlexLayoutEditor })
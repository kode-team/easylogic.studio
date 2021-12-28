import { CLICK, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { CSS_TO_STRING, STRING_TO_CSS } from "el/utils/func";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { variable } from 'el/sapa/functions/registElement';

import "./FlexLayoutEditor.scss";

export default class FlexLayoutEditor extends EditorElement {


    getDirectionOptions () {
        return this.makeOptionsFunction('row,column,row-reverse,column-reverse')
    } 
    
    getWrapOptions () {
        return this.makeOptionsFunction('nowrap,wrap')
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
        return variable(options.split(',').map(it => {
            return { value: it, text: this.$i18n('flex.layout.editor.' + it) }
        }));
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

    modifyData(key, value) {
        this.parent.trigger(this.props.onchange, key, value)
    }

    [LOAD('$body')] () {
        return /*html*/`
            <div class='flex-layout-item'>
                <div class="grid-2">
                    <div>

                        <object refClass="SelectIconEditor" 
                            key='flex-direction'
                            value="${this.state['flex-direction'] || 'row'}"
                            options="${this.getDirectionOptions()}"
                            icons=${variable(['east', 'south', 'west', 'north'])}
                            onchange='changeKeyValue'
                        />
                    </div>

                    <div>
                        <label>
                            <input type="checkbox" ${this.state['flex-wrap'] === 'wrap' ? 'checked' : ''} ref="$wrap" /> Wrap
                        </label>
                    </div>
                </div>

            </div>
            <div class='flex-layout-item'>

            </div>
            <div class='flex-layout-item'>
                <object refClass="SelectIconEditor" 
                    key='justify-content'
                    label="${this.$i18n('flex.layout.editor.justify-content')}"
                    value="${this.state['justify-content'] || 'flex-start'}"
                    options="${this.getJustifyContentOptions()}"
                    icons=${variable(['start', 'end', 'center', 'horizontal_distribute', 'justify_content_space_around'])}
                    onchange='changeKeyValue'
                />
            </div>
            <div class='flex-layout-item'>
                <object refClass="SelectIconEditor" 
                    label="${this.$i18n('flex.layout.editor.align-items')}"
                    key='align-items'
                    value="${this.state['align-items'] || 'flex-start'}"
                    options="${this.getAlignItemsOptions()}"
                    icons=${variable(['vertical_align_top', 'vertical_align_bottom', 'vertical_align_center', 'vertical_align_baseline', 'vertical_align_stretch'])}
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


    [SUBSCRIBE_SELF('changeKeyValue')] (key, value, params) {

        this.setState({
            [key]: value
        }, false)

        this.modifyData(key, value);
    }

    [CLICK('$wrap')] () {
        const checked = !this.refs.$wrap.checked();

        this.setState({
            'flex-wrap': checked ? 'wrap' : 'nowrap'
        }, false)
        this.modifyData('flex-wrap', checked ? 'wrap' : 'nowrap')
    }
}
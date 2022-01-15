import { CLICK, LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import { CSS_TO_STRING, STRING_TO_CSS } from "el/utils/func";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { variable } from 'el/sapa/functions/registElement';

import "./FlexLayoutEditor.scss";
import { iconUse } from "el/editor/icon/icon";
import { FlexWrap } from "el/editor/types/model";

export default class FlexLayoutEditor extends EditorElement {

    initialize() {
        super.initialize();

        this.notEventRedefine = true;
    }

    getDirectionOptions () {
        return this.makeOptionsFunction('row,column')
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
            ...this.props.value
        }
    }

    setValue (value) {
        this.setState({
            ...value,
        })
    }

    getValue () {
        return this.state
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
                            ref='$flexDirection'
                            value="${this.state['flex-direction'] || 'row'}"
                            options="${this.getDirectionOptions()}"
                            icons=${variable(['east', 'south'])}
                            onchange='changeKeyValue'
                        />
                    </div>
                    <div>
                        <object refClass="NumberInputEditor" ${variable({
                            compact: true,
                            ref: '$flex-gap',
                            label: iconUse('space'),
                            key: 'gap',
                            value: this.state.gap,
                            min: 0,
                            max: 100,
                            step: 1,
                            onchange: 'changeKeyValue'
                        })}

                        />
                    </div>
                    <div>
                        <object refClass="NumberInputEditor" ${variable({
                            compact: true,
                            label: iconUse('padding'),
                            key: 'padding',
                            ref: '$padding',
                            value: this.state.gap,
                            min: 0,
                            max: 100,
                            step: 1,
                            onchange: 'changePadding'
                        })}

                        />
                    </div>


                    <div>
                        <object refClass="ToggleButton" ${variable({
                            compact: true,
                            key: 'flex-wrap',
                            ref: '$wrap',
                            checkedValue: 'wrap',
                            value: this.state['flex-wrap'] || FlexWrap.NOWRAP,
                            toggleLabels: ['wrap', 'wrap'],
                            toggleValues: [FlexWrap.NOWRAP, FlexWrap.WRAP],
                            onchange: 'changeKeyValue'
                        })}

                        />
                    </div>
                </div>

            </div>

            <div class="select-flex-direction">
                <div class="padding-top"></div>
                <div class="padding-left"></div>
                <div class="padding-right"></div>
                <div class="padding-bottom"></div>

                <div class="flex-group">

                    <div class="flex-row">
                        <div class="flex-direction" data-value="row">
                            <div class="flex-direction-item" data-index="1"></div>
                            <div class="flex-direction-item" data-index="2"></div>
                            <div class="flex-direction-item" data-index="3"></div>
                        </div>

                        <div class="flex-direction" data-value="row">
                            <div class="flex-direction-item" data-index="1"></div>
                            <div class="flex-direction-item" data-index="2"></div>
                            <div class="flex-direction-item" data-index="3"></div>
                        </div>

                        <div class="flex-direction" data-value="row">
                            <div class="flex-direction-item" data-index="1"></div>
                            <div class="flex-direction-item" data-index="2"></div>
                            <div class="flex-direction-item" data-index="3"></div>
                        </div>
                    </div>
                </div>

                <div class="flex-direction" data-value="column"></div>
            </div>

            <div class='flex-layout-item'>
                <div class="title">${this.$i18n('flex.layout.editor.justify-content')}</div>
                <object refClass="SelectIconEditor" 
                    key='justify-content'
                    ref='$justify'
                    value="${this.state['justify-content'] || 'flex-start'}"
                    options="${this.getJustifyContentOptions()}"
                    icons=${variable(['start', 'end', 'center', 'horizontal_distribute', 'justify_content_space_around'])}
                    onchange='changeKeyValue'
                />
            </div>
            <div class='flex-layout-item'>
                <div class="title">${this.$i18n('flex.layout.editor.align-items')}</div>            
                <object refClass="SelectIconEditor" 
                    key='align-items'
                    ref='$alignItems'
                    value="${this.state['align-items'] || 'flex-start'}"
                    options="${this.getAlignItemsOptions()}"
                    icons=${variable(['vertical_align_top', 'vertical_align_bottom', 'vertical_align_center', 'vertical_align_baseline', 'vertical_align_stretch'])}
                    onchange='changeKeyValue'
                />
            </div>
            <div class='flex-layout-item'>
                <div class="title">${this.$i18n('flex.layout.editor.align-content')}</div>                        
                <object refClass="SelectIconEditor" 
                    key='align-content'
                    ref='$alignContent'
                    value="${this.state['align-content'] || 'flex-start'}"
                    options="${this.getAlignContentOptions()}"
                    icons=${variable(['vertical_align_top', 'vertical_align_bottom', 'vertical_align_center', 'horizontal_distribute', 'justify_content_space_around', 'vertical_align_stretch'])}                    
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

    [SUBSCRIBE_SELF('changePadding')] (key, value) {

        this.setState({
            [key]: value
        }, false)

        this.modifyData(key, { 
            'padding-top': value,
            'padding-left': value,
            'padding-right': value,
            'padding-bottom': value,
        });
    }    

    [CLICK('$wrap')] () {
        const checked = !this.refs.$wrap.checked();

        this.setState({
            'flex-wrap': checked ? 'wrap' : 'nowrap'
        }, false)
        this.modifyData('flex-wrap', checked ? 'wrap' : 'nowrap')
    }
}
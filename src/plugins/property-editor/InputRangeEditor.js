
import { Length } from "el/editor/unit/Length";
import { LOAD, INPUT, CLICK, FOCUS, BLUR, SUBSCRIBE, SUBSCRIBE_SELF } from "el/sapa/Event";
import icon from "el/editor/icon/icon";
import { OBJECT_TO_CLASS } from "el/utils/func";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './InputRangeEditor.scss';
export default class InputRangeEditor extends EditorElement {

    initState() {
        var units =  this.props.units || 'px,em,%,auto';
        var value = Length.parse(this.props.value || Length.z());
        let label = this.props.label || ''; 

        if (icon[label]) {
            label = icon[label];
        }

        return {
            removable: this.props.removable === 'true',
            label,
            compact: this.props.compact === 'true',
            min: +this.props.min || 0,
            max: +this.props.max || 100,
            step: +this.props.step || 1,
            key: this.props.key,
            params: this.props.params || '',
            layout: this.props.layout || '',
            disabled: this.props.disabled === 'true',
            units,
            value
        }
    }

    template () {
        return /*html*/`<div class='small-editor' ref='$body'></div>`
    }

    [LOAD('$body')] () {

        var { min, max, step, label, compact, removable, layout, disabled } = this.state

        var value = +this.state.value.value.toString()

        if (isNaN(value)) {
            value = 0
        }

        var layoutClass = layout;

        var realValue = (+value).toString();

        return /*html*/`
        <div 
            ref="$range",
            class="${OBJECT_TO_CLASS({
                'elf--input-range-editor': true,
                'has-label': !!label,
                'compact': !!compact,
                'is-removable': removable,
                'disabled': disabled,
                [layoutClass] : true 
            })}"
        >
            ${label ? `<label>${label}</label>` : '' }
            <div class='range--editor-type' data-type='range'>
                <div class='area'>
                    <input type='number' ref='$propertyNumber' value="${realValue}" min="${min}" max="${max}" step="${step}" tabIndex="1" />
                    
                    <object refClass="SelectEditor"  ref='$unit' key='unit' value="${this.state.selectedUnit || this.state.value.unit}" options="${this.state.units}" onchange='changeUnit' />
                    
                </div>
            </div>
            <button type='button' class='remove' ref='$remove' title='Remove'>${icon.remove}</button>
        </div>
    `
    }

    getValue() {
        return this.state.value.clone(); 
    }

    setValue (value) {
        this.setState({
            value: Length.parse(value)
        })

        // console.log(this.state.value.value);

        // this.refs.$propertyNumber.val(this.state.value.value); 
        // this.children.$unit.setValue(this.state.value.unit)
    }

    disabled () {
        this.setState({
            disabled: true
        })
    }

    enabled () {
        this.setState({
            disabled: false
        })
    }    

    [FOCUS('$propertyNumber')] (e) {
        this.refs.$range.addClass('focused');
    }

    [BLUR('$propertyNumber')] (e) {
        this.refs.$range.removeClass('focused');
    }


    [CLICK('$remove')] (e) {
        this.updateData({
            value: ''
        })
    }

    updateData (data) {
        this.setState(data, false)
        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }

    initValue () {
        if (this.state.value == '') {
            this.state.value = new Length(0, this.children.$unit.getValue())
        }   
    }

    [INPUT('$propertyNumber')] (e) {

        var value = +this.getRef('$propertyNumber').value; 
        
        this.initValue()

        this.updateData({ 
            value: new Length(value, this.children.$unit.getValue())
        });
    }

    [SUBSCRIBE_SELF('changeUnit')] (key, value) {

        this.initValue();

        this.updateData({
            value: this.state.value.toUnit(value)
        })
    }
}
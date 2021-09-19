import { Length } from "el/editor/unit/Length";
import { LOAD, INPUT, FOCUS, BLUR } from "el/sapa/Event";
import icon from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './NumberInputEditor.scss';

export default class NumberInputEditor extends EditorElement {

    initState() {
        var value = Length.parse(this.props.value || Length.number(0));

        value = value.toUnit('number');
        let label = this.props.label || ''; 

        if (icon[label]) {
            label = icon[label];
        }        
        return {
            label,
            compact: this.props.compact === 'true',            
            min: +this.props.min || 0,
            max: +this.props.max || 100,
            step: +this.props.step || 1,
            key: this.props.key,
            params: this.props.params || '',
            layout: this.props.layout || '',
            value
        }
    }

    template () {
        return `<div class='small-editor' ref='$body'></div>`
    }

    [LOAD('$body')] () {
        var { min, max, step, label, type, layout, compact } = this.state

        var value = +this.state.value.value.toString()

        if (isNaN(value)) {
            value = 0
        }

        var hasLabel = !!label ? 'has-label' : ''
        var hasCompact = !!compact ? 'compact' : ''        
        var layoutClass = layout;

        var realValue = (+value).toString();
        
        return /*html*/`
        <div class='elf--number-input-editor ${hasLabel} ${hasCompact} ${layoutClass}' 
            ref="$range"
            data-selected-type='${type}'>
            ${label ? `<label>${label}</label>` : '' }
            <div class='range--editor-type' data-type='range'>
                <div class='area'>
                    <input type='number' ref='$propertyNumber' value="${realValue}" min="${min}" max="${max}" step="${step}" />
                </div>
            </div>
        </div>
    `
    }

    getValue() {
        return this.state.value || 0; 
    }

    setValue (value) {
        this.setState({
            value: Length.parse(value)
        }, false)
        this.refs.$propertyNumber.val(this.state.value.value)
    }

    updateData (data) {
        this.setState(data, false)
        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }


    [FOCUS('$propertyNumber')] (e) {
        this.refs.$range.addClass('focused');
    }

    [BLUR('$propertyNumber')] (e) {
        this.refs.$range.removeClass('focused');
    }    

    [INPUT('$propertyNumber')] (e) {
        var value = +this.getRef('$propertyNumber').value; 

        this.updateData({ 
            value: this.state.value.set(value)
        });

    }
}
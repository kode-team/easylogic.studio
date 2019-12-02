import UIElement from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";
import { LOAD, INPUT, CLICK } from "../../../util/Event";
import icon from "../icon/icon";

export default class NumberInputEditor extends UIElement {

    initState() {
        var value = Length.parse(this.props.value || Length.number(0));

        value = value.toUnit('number');
        return {
            label: this.props.label || '',
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

        var { min, max, step, label, type, layout } = this.state

        var value = +this.state.value.value.toString()

        if (isNaN(value)) {
            value = 0
        }

        var hasLabel = !!label ? 'has-label' : ''
        var layoutClass = layout;

        var realValue = (+value).toString();
        
        return /*html*/`
        <div class='number-input-editor ${hasLabel} ${layoutClass}' data-selected-type='${type}'>
            ${label ? `<label>${label}</label>` : '' }
            <div class='range-editor-type' data-type='range'>
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
        })
    }

    updateData (data) {
        this.setState(data, false)
        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }

    [INPUT('$propertyNumber')] (e) {

        var value = +this.getRef('$propertyNumber').value; 

        this.updateData({ 
            value: this.state.value.set(value)
        });

    }
}
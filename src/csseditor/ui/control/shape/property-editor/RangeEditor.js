import UIElement, { EVENT } from "../../../../../util/UIElement";
import { Length } from "../../../../../editor/unit/Length";
import { LOAD, CHANGE, INPUT } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";
import { EMPTY_STRING } from "../../../../../util/css/types";

export default class RangeEditor extends UIElement {

    initState() {
        var units = this.props.units || 'px,em,%';
        return {
            label: this.props.label || '',
            min: +this.props.min || 0,
            max: +this.props.max || 100,
            step: +this.props.step || 1,
            key: this.props.key,
            params: this.props.params || '',
            units: units.split(','),
            value: Length.parse(this.props.value)
        }
    }

    template() {

        var { min, max, step, label } = this.state

        var value = this.state.value.value.toString()
        var hasLabel = !!label ? 'has-label' : ''
        return `
        <div class='range-editor ${hasLabel}'>
            ${label ? `<label>${label}</label>` : EMPTY_STRING }
            <input type='range' ref='$property' value="${value}" min="${min}" max="${max}" step="${step}" />
            <input type='number' ref='$propertyNumber' value="${value}" min="${min}" max="${max}" step="${step}" />
            <select  ref='$propertyUnit'></select>
        </div>
    `
    }

    [LOAD('$propertyUnit')] () {
        return this.state.units.map(it => {
            var selected = it === this.state.value.unit ? 'selected' : '' 
            return `<option ${selected} value="${it}">${it}</option>`
        })
    }


    updateData (data) {
        this.setState(data)

        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }

    [INPUT('$propertyNumber')] (e) {

        var value = this.getRef('$propertyNumber').value; 

        this.getRef('$property').val(value);
        var unit = this.getRef('$propertyUnit').value;

        this.updateData({ 
            value: new Length(value, unit) 
        });
    }


    [INPUT('$property')] (e) {
        var value = this.getRef('$property').value; 
        this.getRef('$propertyNumber').val(value);

        var unit = this.getRef('$propertyUnit').value;

        this.updateData({ 
            value: new Length(value, unit) 
        });

    }

    [CHANGE('$propertyUnit')] (e) {
        var unit = this.getRef('$propertyUnit').value; 

        this.updateData({
            value: this.state.value.toUnit(unit)
        })

    }
}
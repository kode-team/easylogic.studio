import UIElement, { EVENT } from "../../../../../util/UIElement";
import { Length } from "../../../../../editor/unit/Length";
import { LOAD, CHANGE, INPUT } from "../../../../../util/Event";
import { html } from "../../../../../util/functions/func";

export default class RangeEditor extends UIElement {

    initState() {
        var units = this.props.units || 'px,em,%';
        return {
            key: this.props.key,
            params: this.props.params || '',
            units: units.split(','),
            value: Length.parse(this.props.value)
        }
    }

    template() {
        var value = this.state.value.value.toString()

        return `
        <div class='range-editor'>
            <input type='range' ref='$property' value="${value}" />
            <input type='number' ref='$propertyNumber' value="${value}" />
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
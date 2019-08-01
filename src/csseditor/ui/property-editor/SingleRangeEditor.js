import UIElement, { EVENT } from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";
import { LOAD, INPUT, CLICK } from "../../../util/Event";

import icon from "../icon/icon";
import SelectEditor from "./SelectEditor";

export default class SingleRangeEditor extends UIElement {

    components() {
        return {
            SelectEditor
        }
    }

    initState() {
        var units = this.props.units || 'px,em,%';
        var value = Length.parse(this.props.value || Length.px(0));
        return {
            removable: this.props.removable === 'true',
            calc:  this.props.calc === 'false'  ? false : true,
            label: this.props.label || '',
            min: +this.props.min || 0,
            max: +this.props.max || 100,
            step: +this.props.step || 1,
            key: this.props.key,
            params: this.props.params || '',
            units,
            type: (value.unit === 'calc' || value.unit === 'var') ? 'calc' : 'range',
            value
        }
    }

    template () {
        return `<div class='small-editor' ref='$body'></div>`
    }

    [LOAD('$body')] () {

        var { min, max, step, label, calc, type, removable } = this.state

        var value = +this.state.value.value.toString()

        if (isNaN(value)) {
            value = 0
        }

        var hasLabel = !!label ? 'has-label' : ''
        var hasCalc = calc ? 'has-calc' : '';
        var isRemovable = removable ? 'is-removable' : '';

        var realValue = (+value).toString();
        
        return `
        <div class='range-editor ${hasLabel} ${hasCalc} ${isRemovable}' data-selected-type='${type}' ref='$range'>
            ${label ? `<label>${label}</label>` : '' }
            <button type='button' class='type-button' ref='$toggleType'>${icon.autorenew}</button>
            <div class='range-editor-type' data-type='range'>
                <div class='area'>
                    <input type='range' ref='$property' value="${realValue}" min="${min}" max="${max}" step="${step}" />
                    <input type='number' ref='$propertyNumber' value="${realValue}" min="${min}" max="${max}" step="${step}" />
                    <label>${this.props['selected-unit'] || this.state.units[0] || this.state.value.unit}</label>
                </div>
            </div>
            <div class='range-editor-type' data-type='calc'>
                <div class='area'>
                    <SelectEditor ref='$varType' key='varType' value="${this.state.value.unit}" options="calc,var" onchange='changeVarType' />
                    <input type='text' ref='$calc' value='${this.state.value}' />
                </div>
            </div>
            <button type='button' class='remove' ref='$remove'>${icon.close}</button>
        </div>
    `
    }

    getValue() {
        return this.state.value; 
    }

    setValue (value) {
        this.setState({
            value: Length.parse(value)
        })
    }

    [CLICK('$toggleType')] (e) {

        var type = this.state.type === 'calc' ? 'range' : 'calc';
        var value = '' 
        if (type === 'calc') {
            value = Length.calc(this.refs.$calc.value) 
        } else {
            var value = this.getRef('$propertyNumber').value; 
            var unit = this.children.$unit.getValue();
            value = new Length(value, unit) 
        }

        this.updateData({
            type, value 
        }) 

        this.refs.$range.attr('data-selected-type', type);
    }

    [CLICK('$remove')] (e) {
        this.updateData({
            value: ''
        })
    }

    [INPUT('$calc')] () {
        this.updateData({ 
            value: new Length(this.refs.$calc.value, this.children.$varType.getValue()) 
        });
    }

    updateData (data) {
        this.setState(data, false)
        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }

    updateCalc () {
        this.refs.$calc.val(this.state.value);
    }

    [INPUT('$propertyNumber')] (e) {

        var value = +this.getRef('$propertyNumber').value; 
        this.getRef('$property').val(value);

        this.updateData({ 
            value: this.state.value.set(value)
        });

        this.updateCalc()
    }


    [INPUT('$property')] (e) {
        var value = +this.getRef('$property').value; 
        this.getRef('$propertyNumber').val(value);

        if (this.state.value === '') {
            this.state.value = new Length(0, this.children.$unit.getValue())
        }

        this.updateData({ 
            value: this.state.value.set(value)
        });

        this.updateCalc()
    }

    [EVENT('changeUnit')] (key, value) {
        this.updateData({
            value: this.state.value.toUnit(value)
        })

        this.updateCalc()
    }

    [EVENT('changeVarType')] (key, unit) {
        this.updateData({
            value: new Length(this.refs.$calc.value, unit)
        })
    }
}
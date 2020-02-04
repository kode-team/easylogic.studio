import UIElement, { EVENT } from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";
import { LOAD, INPUT, CLICK, FOCUS, BLUR } from "../../../util/Event";
import icon from "../icon/icon";
import SelectEditor from "./SelectEditor";
import { OBJECT_TO_CLASS, OBJECT_TO_PROPERTY, isUndefined } from "../../../util/functions/func";

export default class RangeEditor extends UIElement {

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
            calc:  this.props.calc === 'true'  ? true : false,
            label: this.props.label || '',
            min: +this.props.min || 0,
            max: +this.props.max || 100,
            step: +this.props.step || 1,
            key: this.props.key,
            params: this.props.params || '',
            layout: this.props.layout || '',
            units,
            type: (value.unit === 'calc' || value.unit === 'var') ? 'calc' : 'range',
            value
        }
    }

    template () {
        return `<div class='small-editor' ref='$body'></div>`
    }

    refresh() {
        this.load();
    }

    [LOAD('$body')] () {

        var { min, max, step, label, calc, type, removable, layout } = this.state

        var value = +this.state.value.value.toString()

        if (isNaN(value)) {
            value = 0
        }

        var layoutClass = layout;

        var realValue = (+value).toString();

        var units = this.state.units.split(',').map(it => {
            let description = it; 
            if (description === 'number')  {
                description = '';
            }
            return `${it}:${description}`
        }).join(',');

        return /*html*/`
        <div ${OBJECT_TO_PROPERTY({
            'data-selected-type': type,
            'ref': '$range',
            'class': OBJECT_TO_CLASS({
                'range-editor': true,
                'has-label': !!label,
                'has-calc': calc,
                'is-removable': removable,
                [layoutClass] : true 
            })
        })}>
            ${label ? `<label>${label}</label>` : '' }
            <button type='button' class='type-button' ref='$toggleType'>${icon.autorenew}</button>
            <div class='range-editor-type' data-type='range'>
                <input type='range' ref='$property' value="${realValue}" min="${min}" max="${max}" step="${step}" /> 
                <div class='area' ref='$rangeArea'>
                    <input type='number' ref='$propertyNumber' value="${realValue}" min="${min}" max="${max}" step="${step}" />
                    <SelectEditor ref='$unit' key='unit' value="${this.state.selectedUnit || this.state.value.unit}" options="${units}" onchange='changeUnit' />
                </div>
            </div>
            <div class='range-editor-type' data-type='calc'>
                <div class='area'>
                    <SelectEditor ref='$varType' key='varType' value="${this.state.value.unit}" options="calc,var" onchange='changeVarType' />

                    <input type='text' ref='$calc' value='${this.state.value}' />
                </div>
            </div>
            <button type='button' class='remove thin' ref='$remove' title='Remove'>${icon.remove}</button>
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
    }

    [FOCUS('$propertyNumber')] (e) {
        this.refs.$rangeArea.addClass('focused');
    }

    [BLUR('$propertyNumber')] (e) {
        this.refs.$rangeArea.removeClass('focused');
    }    

    [CLICK('$toggleType')] (e) {

        var type = this.state.type === 'calc' ? 'range' : 'calc';
        var value = '' 
        if (type === 'calc') {
            value = Length.calc(this.refs.$calc.value) 

            var varType = value.unit;

            this.children.$varType.setValue(varType);
            
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

    initValue () {
        if (this.state.value == '') {
            this.state.value = new Length(0, this.children.$unit.getValue())
        }
        
    }

    [INPUT('$propertyNumber')] (e) {

        var value = +this.getRef('$propertyNumber').value; 
        this.getRef('$property').val(value);
        
        this.initValue()

        this.updateData({ 
            value: new Length(value, this.children.$unit.getValue())
        });

        this.updateCalc()
    }


    [INPUT('$property')] (e) {
        var value = +this.getRef('$property').value; 
        this.getRef('$propertyNumber').val(value);

        this.initValue();

        this.updateData({ 
            value: new Length(value, this.children.$unit.getValue())
        });

        this.updateCalc()
    }

    [EVENT('changeUnit')] (key, value) {

        this.initValue();

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
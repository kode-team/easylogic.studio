import UIElement, { EVENT } from "../../../../../util/UIElement";
import { Length } from "../../../../../editor/unit/Length";
import { LOAD, CHANGE, INPUT, CLICK } from "../../../../../util/Event";
import { EMPTY_STRING } from "../../../../../util/css/types";
import icon from "../../../icon/icon";
import SelectEditor from "./SelectEditor";



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
            calc: this.props.calc === 'false' ? false : true,
            label: this.props.label || '',
            min: +this.props.min || 0,
            max: +this.props.max || 100,
            step: +this.props.step || 1,
            key: this.props.key,
            params: this.props.params || '',
            units: units.split(','),
            type: value.unit === 'calc' ? 'calc' : 'range',
            value
        }
    }

    template() {

        var { min, max, step, label, calc } = this.state

        var value = +this.state.value.value.toString()

        if (isNaN(value)) {
            value = 0
        }

        var hasLabel = !!label ? 'has-label' : ''
        var hasCalc = calc ? 'has-calc' : '';
        return `
        <div class='range-editor ${hasLabel} ${hasCalc}' data-selected-type='${this.state.type}'>
            ${label ? `<label>${label}</label>` : EMPTY_STRING }
            <button type='button' class='type-button' ref='$toggleType'>${icon.autorenew}</button>
            <div class='range-editor-type' data-type='range'>
                <div class='area'>
                    <input type='range' ref='$property' value="${+value}" min="${min}" max="${max}" step="${step}" />
                    <input type='number' ref='$propertyNumber' value="${+value}" min="${min}" max="${max}" step="${step}" />
                    
                    <SelectEditor ref='$unit' key='unit' value="${this.state.selectedUnit || this.state.value.unit}" options="${this.state.units}" onchange='changeUnit' />
                    
                </div>
            </div>
            <div class='range-editor-type' data-type='calc'>
                <div class='area'>
                    <span>calc</span>
                    <input type='text' ref='$calc' value='${this.state.value}' />
                </div>
            </div>
        </div>
    `
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

        this.$el.attr('data-selected-type', type);
    }

    [INPUT('$calc')] () {
        this.updateData({ 
            value: Length.calc(this.refs.$calc.value) 
        });
    }

    updateData (data) {
        this.setState(data)

        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }

    updateCalc () {
        this.refs.$calc.val(this.state.value);
    }

    [INPUT('$propertyNumber')] (e) {

        var value = this.getRef('$propertyNumber').value; 
        this.getRef('$property').val(value);

        this.updateData({ 
            value: this.state.value.set(value)
        });

        this.updateCalc()
    }


    [INPUT('$property')] (e) {
        var value = this.getRef('$property').value; 
        this.getRef('$propertyNumber').val(value);

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
}
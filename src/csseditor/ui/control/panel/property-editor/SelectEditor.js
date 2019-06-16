import UIElement from "../../../../../util/UIElement";
import { LOAD, CHANGE, BIND } from "../../../../../util/Event";
import { EMPTY_STRING } from "../../../../../util/css/types";

export default class SelectEditor extends UIElement {

    initState() {
        var splitChar = this.props.split || ',';
        var options = (this.props.options || '').split(splitChar).map(it => it.trim());

        var value = this.props.value;

        return {
            label: this.props.label || '',
            options, value
        }
    }

    template() {
        var { label } = this.state; 
        var hasLabel = !!label ? 'has-label' : ''
        return `
            <div class='select-editor ${hasLabel}'>
                ${label ? `<label>${label}</label>` : EMPTY_STRING }
                <select ref='$options'></select>
            </div>
        `
    }

    getValue () {
        return this.refs.$options.value; 
    }

    [BIND('$options')] () {
        return {
            // 'disabled': this.state.options.length === 1,
            'data-count': this.state.options.length.toString()
        }
    }

    [LOAD('$options')] () {
        return this.state.options.map(it => {

            var selected = it === this.state.value ? 'selected' : '' 
            var value = it; 
            var label = it; 

            if (label === '') {
                label = '< none-value >'
            } else if (label === '-') {
                label = '----------'
                value = ''; 
            }

            return `<option ${selected} value="${value}">${label}</option>`
        })
    }

    [CHANGE('$options')] () {
        this.updateData({
            value: this.refs.$options.value 
        })
    }


    updateData (data) {
        this.setState(data)

        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }
}
import { LOAD, CHANGE, BIND } from "el/base/Event";
import { registElement } from "el/base/registerElement";
import { EditorElement } from "../common/EditorElement";

export default class SelectEditor extends EditorElement {

    initState() {
        var keyValueChar = this.props['key-value-char'] || ':'
        var splitChar = this.props.split || ',';
        var options = (this.props.options || '').split(splitChar).map(it => it.trim());

        var value = this.props.value;
        var tabIndex = this.props.tabindex;

        return {
            keyValueChar,
            splitChar,
            label: this.props.label || '',
            options, 
            value,
            tabIndex
        }
    }

    template() {
        var { label, tabIndex } = this.state; 
        var hasLabel = !!label ? 'has-label' : ''
        var hasTabIndex = !!tabIndex ? 'tabIndex="1"' : ''
        return /*html*/`
            <div class='select-editor ${hasLabel}'>
                ${label ? `<label title="${label}">${label}</label>` : '' }
                <select ref='$options' ${hasTabIndex}></select>
            </div>
        `
    }

    getValue () {
        return this.refs.$options.value; 
    }

    setValue (value) {
        this.state.value = value + ''; 
        this.refs.$options.val(this.state.value);
        this.refresh()
    }

    refresh(reload = false) {
        this.load();
    }

    [BIND('$options')] () {
        return {
            'data-count': this.state.options.length.toString()
        }
    }

    [LOAD('$options')] () {

        var arr = this.state.options.map(it => {

            var value = it; 
            var label = it; 

            if (value.includes(this.state.keyValueChar)) {
                var [value, label] = value.split(this.state.keyValueChar)
            }

            if (label === '') {
                label = this.props['none-value'] ? this.props['none-value'] : ''
            } else if (label === '-') {
                label = '----------'
                value = ''; 
            }
            var selected = value === this.state.value ? 'selected' : '' 
            return `<option ${selected} value="${value}">${label}</option>`
        })

        return arr; 
    }

    setOptions (options = '') {
        this.setState({ 
            options: options.split(this.state.splitChar).map(it => it.trim()) 
        })
    }

    [CHANGE('$options')] () {
        this.updateData({
            value: this.refs.$options.value 
        })
    }


    updateData (data) {
        this.setState(data, false)

        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }
}

registElement({ SelectEditor })
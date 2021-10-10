import { LOAD, CHANGE, BIND } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './SelectEditor.scss';
export default class SelectEditor extends EditorElement {

    initialize() {
        super.initialize();
    
        this.notEventRedefine = true;
    }

    initState() {
        var splitChar = this.props.split || ',';

        var options = Array.isArray(this.props.options)
            ? this.props.options.map(it => {
                if (typeof (it) === 'string') {
                    return { value: it }
                }
                return it;
            })
            : (this.props.options || '').split(splitChar).map(it => it.trim()).map(it => {
                const [value, text] = it.split(':');
                return { value, text }
            });

        var value = this.props.value;
        var tabIndex = this.props.tabindex;

        return {
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
            <div class='elf--select-editor ${hasLabel}'>
                ${label ? `<label title="${label}">${label}</label>` : ''}
                <select ref='$options' ${hasTabIndex}></select>
            </div>
        `
    }

    getValue() {
        return this.refs.$options.value;
    }

    setValue(value) {
        this.state.value = value + '';
        this.refs.$options.val(this.state.value);
        this.refresh()
    }

    refresh(reload = false) {
        this.load();
    }

    [BIND('$options')]() {
        return {
            'data-count': this.state.options.length.toString()
        }
    }

    [LOAD('$options')]() {

        var arr = this.state.options.map(it => {

            var value = it.value;
            var label = it.text || it.value;

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

    [CHANGE('$options')]() {
        this.updateData({
            value: this.refs.$options.value
        })
    }


    updateData(data) {
        this.setState(data, false)

        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }
}
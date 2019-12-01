import UIElement from "../../../util/UIElement";
import { LOAD, CLICK } from "../../../util/Event";
import icon from "../icon/icon";

export default class SelectIconEditor extends UIElement {

    initState() {
        var keyValueChar = this.props['key-value-char'] || ':'        
        var splitChar = this.props.split || ',';
        var options = (this.props.options || '').split(splitChar).map(it => it.trim());
        var icons = (this.props.icons || '').split(splitChar).map(it => it.trim());

        var value = this.props.value || '';

        return {
            keyValueChar,            
            label: this.props.label || '',
            options, icons, value
        }
    }

    template() {
        var { label } = this.state; 
        var hasLabel = !!label ? 'has-label' : ''
        return /*html*/`
            <div class='select-icon-editor ${hasLabel}'>
                ${label ? `<label>${label}</label>` : '' }
                <div class='items' ref='$options'></div>
            </div>
        `
    }

    [CLICK('$close')] () {
        this.updateData({
            value: ''
        })
        this.refresh();
    }

    getValue () {
        return this.state.value || ''; 
    }

    setValue (value) {
        this.state.value = value + ''; 

        var $selectedItem = this.refs.$options.$(`[data-value="${this.state.value}"]`)

        if ($selectedItem) {
            $selectedItem.onlyOneClass('selected');
        }
    }

    refresh(reload = false) {

        if (reload) {
            var $selectedItem = this.refs.$options.$(`[data-value="${this.state.value}"]`)

            if ($selectedItem) {
                $selectedItem.onlyOneClass('selected');
            }
        } else {
            this.load();
        }

    }

    [LOAD('$options')] () {
        return this.state.options.map((it, index) => {


            var value = it; 
            var label = it; 

            if (value.includes(this.state.keyValueChar)) {
                var [value, label] = value.split(this.state.keyValueChar)
            }            
            var selected = value === this.state.value ? 'selected' : '' 
            if (it === '') {
                var label = icon.close
            } else {
                var iconKey = this.state.icons[index];

                label = label || icon[iconKey] || iconKey || it; 
            }
            
            return /*html*/`<div class='select-icon-item ${selected}' data-value="${value}" title='${label}'>${label}</div>`
        })
    }

    [CLICK('$options .select-icon-item')] (e) {

        var value = e.$delegateTarget.attr('data-value')

        e.$delegateTarget.onlyOneClass('selected');

        this.updateData({
            value
        })
    }


    updateData (data) {
        this.setState(data, false)

        this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params)
    }
}
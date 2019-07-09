import UIElement from "../../../../../util/UIElement";
import { LOAD, CLICK } from "../../../../../util/Event";
import icon from "../../../icon/icon";

export default class SelectIconEditor extends UIElement {

    initState() {
        var splitChar = this.props.split || ',';
        var options = (this.props.options || '').split(splitChar).map(it => it.trim());
        var icons = (this.props.icons || '').split(splitChar).map(it => it.trim());

        var value = this.props.value;

        return {
            label: this.props.label || '',
            options, icons, value
        }
    }

    template() {
        var { label } = this.state; 
        var hasLabel = !!label ? 'has-label' : ''
        return `
            <div class='select-icon-editor ${hasLabel}'>
                ${label ? `<label>${label}</label>` : '' }
                <div ref='$options'></div>
            </div>
        `
    }

    getValue () {
        return this.refs.$options.value; 
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

            var selected = it === this.state.value ? 'selected' : '' 
            var value = it; 

            if (it === '') {
                var label = icon.close
            } else {
                var label = icon[this.state.icons[index]] || it; 
            }
            
            return `<div class='select-icon-item ${selected}' data-value="${value}">${label}</div>`
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

        this.parent.trigger(this.props.onchange, this.props.key, this.state.value, this.props.params)
    }
}
import UIElement from "../../../util/UIElement";
import { LOAD, CLICK, VDOM } from "../../../util/Event";
import icon from "../icon/icon";
import { CSS_TO_STRING } from "../../../util/functions/func";

export default class SelectIconEditor extends UIElement {

    initState() {
        var keyValueChar = this.props['key-value-char'] || ':'        
        var splitChar = this.props.split || ',';
        var options = (this.props.options || '').split(splitChar).map(it => it.trim());
        var icons = (this.props.icons || '').split(splitChar).map(it => it.trim());
        var colors = (this.props.colors || '').split(splitChar).map(it => it.trim());

        var value = this.props.value || '';

        return {
            keyValueChar,            
            label: this.props.label || '',
            options, 
            icons, 
            colors,
            value
        }
    }

    template() {
        var { label } = this.state; 
        var hasLabel = !!label ? 'has-label' : ''
        return /*html*/`
            <div class='select-icon-editor ${hasLabel}'>
                ${label ? `<label title="${label}">${label}</label>` : '' }
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

        this.setState({
            value
        })
    }

    [LOAD('$options') + VDOM] () {
        return this.state.options.map((it, index) => {


            var value = it; 
            var label = it; 
            var title = it; 
            var iconClass = ''

            if (value.includes(this.state.keyValueChar)) {
                var [value, label] = value.split(this.state.keyValueChar)
            }            
            var isSelected = value === this.state.value; 
            var selected = isSelected ? 'selected' : '' 
            if (it === '') {
                var label = icon.close
                title = 'close'
            } else {
                var iconKey = this.state.icons[index];

                if (icon[iconKey]) {
                    iconClass = 'icon' 
                }

                title = label 
                label = icon[iconKey] || label || iconKey || it; 

            }

            var color = this.state.colors[index]
            var css = {}
            if (isSelected && color) {
                css['background-color'] = color; 
            }
            
            return /*html*/`<div class='select-icon-item ${selected} ${iconClass}' style='${CSS_TO_STRING(css)}' data-value="${value}" title='${title}'>${label}</div>`
        })
    }

    [CLICK('$options .select-icon-item')] (e) {

        var value = e.$dt.attr('data-value')

        this.updateData({
            value
        })

        this.refresh();
    }


    updateData (data) {
        this.setState(data, false)

        this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params)
    }
}
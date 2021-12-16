
import { LOAD, CLICK, DOMDIFF } from "el/sapa/Event";
import icon from "el/editor/icon/icon";
import { isString } from "el/sapa/functions/func";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './SelectIconEditor.scss';
import { CSS_TO_STRING } from "el/utils/func";

export default class SelectIconEditor extends EditorElement {

    initialize() {
        super.initialize();
    
        this.notEventRedefine = true;
    }

    initState() {
        var splitChar = this.props.split || ',';
        var options = Array.isArray(this.props.options) 
                        ? this.props.options.map(it => {
                            if (isString(it)) {
                                return { value: it }
                            }
                            return it;  
                        })
                        : (this.props.options  || '').split(splitChar).map(it => it.trim()).map(it => {
                            const [value, text] = it.split(':');
                            return { value, text }
                        });

        var icons = this.props.icons || [];
        var colors = this.props.colors || [];

        var value = this.props.value || '';

        return {
            label: this.props.label || '',
            compact: this.props.compact === 'true',
            options, 
            icons, 
            colors,
            value
        }
    }

    template() {
        var { label, compact } = this.state; 
        var hasLabel = !!label ? 'has-label' : ''
        var hasCompact = !!compact ? 'compact': '';
        return /*html*/`
            <div class='elf--select-icon-editor ${hasLabel}'>
                ${label ? `<label title="${label}">${label}</label>` : '' }
                <div class='items ${hasCompact}' ref='$options'></div>
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

    [LOAD('$options') + DOMDIFF] () {
        return this.state.options.map((it, index) => {


            var value = it.value; 
            var label = it.text; 
            var title = it.text; 
            var iconClass = ''

            var isSelected = value === this.state.value; 
            var selected = isSelected ? 'selected' : '' 
            if (it.value === '') {
                var label = icon.close
                title = 'close'
            } else {
                var iconKey = this.state.icons[index];

                if (icon[iconKey]) {
                    iconClass = 'icon' 
                }

                title = label 
                label = icon[iconKey] || label || iconKey || it.text || it.value; 
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
import { LOAD, CLICK, SUBSCRIBE_SELF, BIND } from "el/sapa/Event";
import BaseUI from './BaseUI';
import './ToggleCheckBox.scss';


const DEFAULT_LABELS = ['True', 'False']

export default class ToggleCheckBox extends BaseUI {


    initialize() {
        super.initialize();
    
        this.notEventRedefine = true;
    }    

    initState() {
        return {
            label: this.props.label || '',
            checked: this.props.value || false,
            toggleLabels: this.props.toggleLabels || DEFAULT_LABELS
        }
    }

    template () {
        return `<div class='small-editor button' ref='$body'></div>`
    }

    [LOAD('$body')] () {

        var { label, checked } = this.state

        var hasLabel = !!label ? 'has-label' : ''
        var isChecked = checked ? 'true' : 'false'
        var [first, second] = this.state.toggleLabels;
        return /*html*/`
        <div class='elf--toggle-checkbox ${hasLabel}'>
            ${label ? `<label title="${label}">${label}</label>` : '' }
            <div class='area' ref="$area" data-checked="${isChecked}">
                <div><button type="button" value="true">${first}</button></div>
                <div><button type="button" value="false">${second}</button></div>
            </div>
        </div>
    `
    }

    [BIND('$area')] () {
        return {
            'data-checked': this.state.checked ? 'true' : 'false'
        }
    }

    setValue(checked) {
        this.setState({
            checked,
        }, false)

        this.bindData('$area');   
    }

    getValue() {
        return this.state.checked;
    }

    [CLICK('$el button')] (e) {
        this.setValue(e.$dt.value === 'true');
        this.trigger('change');
    }

    [SUBSCRIBE_SELF('change')] () {
        this.sendEvent();
    }
}
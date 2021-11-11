import { LOAD, CLICK, SUBSCRIBE_SELF, BIND } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { isFunction, isArray, isString } from "el/sapa/functions/func";

import './ToggleCheckBox.scss';

export default class CheckBox extends EditorElement {


    initialize() {
        super.initialize();
    
        this.notEventRedefine = true;
    }    

    initState() {
        return {
            label: this.props.label || '',
            text: this.props.text || '',
            params: this.props.params || '',
            checked: this.props.checked || false,
            toggleLabels: this.props.toggleLabels || ['True', 'False']
        }
    }

    template () {
        return `<div class='small-editor button' ref='$body'></div>`
    }

    [LOAD('$body')] () {

        var { label, text, checked } = this.state

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

    setValue(checked, isTrigger = true) {
        this.setState({
            checked,
        }, false)

        this.bindData('$area');   
        
        if (isTrigger) {
            this.trigger('change');
        }
    }

    getValue() {
        return this.state.checked;
    }

    [CLICK('$el button')] (e) {
        this.setValue(e.$dt.value === 'true', true);
    }

    [SUBSCRIBE_SELF('change')] () {

        // onClick 이벤트가 있으면 실행
        if (isFunction(this.props.onClick)) {
            this.props.onClick(this.props.key, this.getValue(), this.props.params);
        } 
        // action 이 있으면 emit 을  실행 
        else if (isString(this.props.action)) {
            this.emit(this.props.action, this.props.key, this.getValue(), this.props.params);
        } 
        // action 이 array 일 때 emit 을 실행 
        else if (isArray(this.props.action)) {
            this.emit(...this.props.action, this.props.key, this.getValue(), this.props.params);
        } 
        // 아무것도 없을 때는 선택할 수 있는 버튼 처럼 동작한다. 
        // key, value 를 던질 수 있도록 한다. 
        else {
            this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params);
        }
    }
  
}
import { LOAD, CLICK } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { isFunction, isArray, isString } from "el/sapa/functions/func";

import './Button.scss';

export default class Button extends EditorElement {


    initialize() {
        super.initialize();
    
        this.notEventRedefine = true;
    }    

    initState() {
        return {
            label: this.props.label || '',
            text: this.props.text || '',
            params: this.props.params || '',
        }
    }

    template () {
        return `<div class='small-editor button' ref='$body'></div>`
    }

    [LOAD('$body')] () {

        var { label, text } = this.state

        var hasLabel = !!label ? 'has-label' : ''
        
        return /*html*/`
        <div class='elf--button ${hasLabel}'>
            ${label ? `<label title="${label}">${label}</label>` : '' }
            <div class='area'>
                <button type="button" >${text || label}</button>
            </div>
        </div>
    `
    }

    [CLICK('$el button')] () {

        // onClick 이벤트가 있으면 실행
        if (isFunction(this.props.onClick)) {
            this.props.onClick(this.props.key, this.props.defaultValue, this.props.params);
        } 
        // action 이 있으면 emit 을  실행 
        else if (isString(this.props.action)) {
            this.emit(this.props.action, this.props.key, this.props.defaultValue, this.props.params);
        } 
        // action 이 array 일 때 emit 을 실행 
        else if (isArray(this.props.action)) {
            this.emit(...this.props.action);
        } 
        // 아무것도 없을 때는 선택할 수 있는 버튼 처럼 동작한다. 
        // key, value 를 던질 수 있도록 한다. 
        else {
            this.parent.trigger(this.props.onchange, this.props.key, this.props.value || this.props.defaultValue, this.props.params);
        }
    }
  
}
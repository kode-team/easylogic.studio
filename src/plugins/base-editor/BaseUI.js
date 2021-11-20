import { LOAD, CLICK } from "el/sapa/Event";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { isFunction, isArray, isString } from "el/sapa/functions/func";

import './Button.scss';

export default class BaseUI extends EditorElement {

    getValue() {
        return this.props.defaultValue;
    }

    sendEvent() {

        const key = this.props.key;
        const value = this.getValue();
        const params = this.props.params;

        // onClick 이벤트가 있으면 실행
        if (isFunction(this.props.onClick)) {
            this.props.onClick(key, value, params);
        } 
        // action 이 있으면 emit 을  실행 
        else if (isString(this.props.action)) {
            this.emit(this.props.action, key, value, params);
        } 
        // action 이 array 일 때 emit 을 실행 
        else if (isArray(this.props.action)) {
            this.emit(...this.props.action, key, value, params);
        } 
        // 아무것도 없을 때는 선택할 수 있는 버튼 처럼 동작한다. 
        // key, value 를 던질 수 있도록 한다. 
        else {
            this.parent.trigger(this.props.onchange, key, value, params);
        }
    }
  
}
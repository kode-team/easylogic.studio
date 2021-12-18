import { isFunction } from "el/sapa/functions/func";
import { Editor } from "el/editor/manager/Editor";

export default {
    command: 'recoverBooleanPath',
    description: 'recover box rectangle for boolean path result',
    /**
     * 
     * @param {Editor} editor 
     * @param {object} multiAttrs  아이디 기반의 속성 리스트  { [id] : { key: value }, .... }
     */
    execute: function (editor) {

        const current = editor.selection.current; 

        let booleanContainer ;
        if (current && current.isBooleanItem) {
            booleanContainer = current.parent;
        } else if (current && current.isBooleanPath) {
            booleanContainer = current;
        }

        if (booleanContainer) {
            // 1. boolean 결과값을 구한다. 
            //   1. boolean path 와  
            //   2. 하위 객체들의 좌표를 
            //   3. 모두 world position 기준으로 바꾸고 
            // 2. boolean 결과값을로 부모의 rect 를 변경한다. 
            // 3. 부모의 rect 를 기준으로 자식의 위치를 변경한다. 
            // 4. selection 을 그대로 유지한다. 
        }

    }
}
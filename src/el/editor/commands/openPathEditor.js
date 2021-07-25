import { Editor } from "el/editor/manager/Editor";
import { Length } from "el/editor/unit/Length";
import { vec3 } from "gl-matrix";


export default {
    command: 'openPathEditor',

    description: 'Show path editor for d property ',

    /**
     * 
     * @param {Editor} editor 
     * @param {object} pathObject 
     * @param {string} pathObject.d    svg path 문자열 
     */
    execute: function (editor, pathObject) {

        var current = editor.selection.current;

        // path-editing 기능 체크 
        // 에디팅 할 때 필드랑 box 스타일 체크 
        // box : 기존 width, height 기준으로 맞춤 
        // canvas : bbox 를 새로 맞춤 
        if (current && current.d) {
            current.setCache();
            
            editor.emit('hideSelectionToolView');

            // box 모드 
            // box - x, y, width, height 고정된 상태로  path 정보만 변경 
            editor.emit('showPathEditor', 'modify', {
                box: 'canvas',
                current,
                d: current.accumulatedPath().d,
            })
        }


    }

}
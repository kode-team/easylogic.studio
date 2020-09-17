import { Editor } from "@manager/Editor";
import PathParser from "@parser/PathParser";

export default {
    command: 'updatePathItem',

    /**
     * 
     * @param {Editor} editor 
     * @param {object} pathObject 
     * @param {string} pathObject.d    svg path 문자열 
     */
    execute: function (editor, pathObject) {

        // d 속성 (path 문자열) 을 설정한다. 
        editor.emit('setAttribute', {
            d: pathObject.d,
            totalLength: pathObject.totalLength,
            path: new PathParser(pathObject.d)
        })
    }

}
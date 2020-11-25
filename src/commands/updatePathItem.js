import { Editor } from "@manager/Editor";
import PathParser from "@parser/PathParser";


export default {
    command: 'updatePathItem',

    description: 'Update path string for selected svg path item',

    /**
     * 
     * @param {Editor} editor 
     * @param {object} pathObject 
     * @param {string} pathObject.d    svg path 문자열 
     */
    execute: function (editor, pathObject) {

        
        const current = editor.selection.current;
        if (current) {
            // d 속성 (path 문자열) 을 설정한다. 
            editor.emit('setAttribute', {
                d: current.invertPathString(pathObject.d),
                totalLength: pathObject.totalLength,
            })
        }


    }

}
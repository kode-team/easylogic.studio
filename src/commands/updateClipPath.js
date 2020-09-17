import { Editor } from "@manager/Editor";

export default {
    command: 'updateClipPath',
    description: 'update clip-path property ',
    /**
     * 
     * @param {Editor} editor 
     * @param {object} pathObject 
     * @param {string} pathObject.d    svg path 문자열 
     */
    execute: function (editor, pathObject) {

        // d 속성 (path 문자열) 을 설정한다. 
        editor.command('setAttribute', 'change clip-path', {
            'clip-path': `path(${pathObject.d})`,
        })
    }

}
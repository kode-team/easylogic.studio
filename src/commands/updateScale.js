import { Editor } from "@manager/Editor";

export default {
    command: 'updateScale',

    /**
     * scale 설정하기 
     * 
     * @param {Editor} editor 
     * @param {number} scale [0.5...5]
     */
    execute: function (editor, scale) {
        const oldScale = editor.viewport.scale; 
        editor.viewport.setScale(scale);
        editor.emit('updateViewport', scale, oldScale)
    }

}
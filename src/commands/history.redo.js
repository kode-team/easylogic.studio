import { Editor } from "@manager/Editor"

export default {
    command : 'history.redo',
    /**
     * 
     * @param {Editor} editor 
     */
    execute: function (editor) {
        editor.history.redo()
    }
}
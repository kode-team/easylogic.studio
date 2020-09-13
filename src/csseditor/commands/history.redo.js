import { Editor } from "../../editor/Editor"

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
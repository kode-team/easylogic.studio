import { Editor } from "el/editor/manager/Editor"

export default {
    command : 'history.redo',
    /**
     * history redo 를 실행한다. 
     * 
     * @param {Editor} editor 
     */
    execute: function (editor) {
        editor.history.redo()
    }
}
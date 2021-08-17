import { Editor } from "el/editor/manager/Editor";
import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command: 'load.json', 

    /**
     * 
     * @param {Editor} editor 
     * @param {*} json 
     */
    execute: function (editor, json) {

        editor.modelManager.load(json);

        // editor.load(projects);
        _doForceRefreshSelection(editor)
    }
}
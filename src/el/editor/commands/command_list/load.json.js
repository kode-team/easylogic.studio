import { Editor } from "el/editor/manager/Editor";
import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command: 'load.json', 

    /**
     * 
     * @param {Editor} editor 
     * @param {*} json 
     */
    execute: function (editor, json, context = { origin: '*'}) {

        editor.modelManager.load(json, context);

        // editor.load(projects);
        _doForceRefreshSelection(editor)
    }
}
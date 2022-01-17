import { Editor } from "el/editor/manager/Editor";
import ClippathEditorView from './ClippathEditorView';


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('canvas.view', {
        ClippathEditorView         
    })
}
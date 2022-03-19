import { Editor } from "el/editor/manager/Editor";
import ClippathEditorView from './ClippathEditorView';


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerUI('canvas.view', {
        ClippathEditorView         
    })
}
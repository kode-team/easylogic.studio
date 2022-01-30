import { Editor } from "el/editor/manager/Editor";
import FillEditorView from './FillEditorView';


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('canvas.view', {
        FillEditorView         
    })
}
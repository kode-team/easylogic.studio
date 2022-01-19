import { Editor } from "el/editor/manager/Editor";
import GradientEditorView from './GradientEditorView';


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('canvas.view', {
        GradientEditorView         
    })
}
import { Editor } from "el/editor/manager/Editor";
import PathEditorView from './PathEditorView';
import PathManager from './PathManager';


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerUI('canvas.view', {
        PathEditorView        
    })

    editor.registerUI('page.subeditor.view', {
        PathManager        
    })


}
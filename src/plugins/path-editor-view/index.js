import { Editor } from "el/editor/manager/Editor";
import PathEditorView from './PathEditorView';
import PathManager from './PathManager';


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('canvas.view', {
        PathEditorView        
    })

    editor.registerMenuItem('page.subeditor.view', {
        PathManager        
    })


}
import { Editor } from "el/editor/manager/Editor";
import PathDrawView from './PathDrawView';
import DrawManager from './DrawManager';


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerUI('canvas.view', {
        PathDrawView        
    })

    editor.registerUI('page.subeditor.view', {
        DrawManager        
    })


}
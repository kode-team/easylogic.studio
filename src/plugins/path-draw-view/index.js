import { Editor } from "el/editor/manager/Editor";
import PathDrawView from './PathDrawView';
import DrawManager from './DrawManager';


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('canvas.view', {
        PathDrawView        
    })

    editor.registerMenuItem('page.subeditor.view', {
        DrawManager        
    })


}
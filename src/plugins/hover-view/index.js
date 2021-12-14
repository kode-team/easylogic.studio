import { Editor } from "el/editor/manager/Editor";
import HoverView from './HoverView';

/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('canvas.view', {
        HoverView         
    })
}
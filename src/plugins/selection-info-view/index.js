import { Editor } from "el/editor/manager/Editor";
import SelectionInfoView from './SelectionInfoView';


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('canvas.view', {
        SelectionInfoView         
    })
}
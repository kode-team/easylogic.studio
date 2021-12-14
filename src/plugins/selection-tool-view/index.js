import { Editor } from "el/editor/manager/Editor";
import SelectionToolView from './SelectionToolView';
import GroupSelectionToolView from './GroupSelectionToolView';


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('canvas.view', {
        SelectionToolView,
        GroupSelectionToolView         
    })
}
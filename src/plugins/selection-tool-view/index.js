import { Editor } from "el/editor/manager/Editor";
import SelectionToolView from './SelectionToolView';
import GroupSelectionToolView from './GroupSelectionToolView';
import GhostToolView from './GhostToolView';


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerMenuItem('canvas.view', {
        GhostToolView,
        SelectionToolView,
        GroupSelectionToolView         
    })
}
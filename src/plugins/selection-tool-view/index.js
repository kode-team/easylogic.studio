import { Editor } from "el/editor/manager/Editor";
import SelectionToolView from './SelectionToolView';
import GroupSelectionToolView from './GroupSelectionToolView';
import GhostToolView from './GhostToolView';
import { CanvasViewToolLevel } from "el/editor/types/editor";


/**
 * 
 * @param {Editor} editor 
 */
export default function (editor) {
    editor.registerUI('canvas.view', {
        GhostToolView,
        SelectionToolView,
        GroupSelectionToolView         
    }, CanvasViewToolLevel.SELECTION_TOOL)
}
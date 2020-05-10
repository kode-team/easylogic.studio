import { isFunction } from "../../util/functions/func";

/**
 * reset selecdtion command 
 * 
 * @param {Editor} editor 
 */
export default function resetSelection (editor) {
    editor.selection.setRectCache();

    editor.emit('setAttribute', {});
    editor.emit('refreshSelectionTool');
}
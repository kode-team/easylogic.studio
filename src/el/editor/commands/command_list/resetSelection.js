import { isFunction } from "el/sapa/functions/func";

/**
 * reset selecdtion command 
 * 
 * @param {Editor} editor 
 */
export default function resetSelection (editor) {
    editor.nextTick(() => {
        editor.emit('refreshSelectionTool');
    })

}
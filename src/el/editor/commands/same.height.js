import { vertiesToRectangle } from "el/base/functions/collision";
import { Editor } from "../manager/Editor";

export default {
    command : 'same.height',
    description : 'fit at the same height',

    /**
     * @param {Editor} editor
     */
    execute: function (editor) {

        var len = editor.selection.length ;

        if (len == 1) {
            // artboard 랑 크기를 맞출지 고민해보자. 
        } else if (len > 1) {
            const rect = vertiesToRectangle(editor.selection.verties);

            editor.command('setAttributeForMulti', 'fit at the same height', editor.selection.packByValue({
                y: rect.y,
                height: rect.height
            }))
        }
        
    }
}
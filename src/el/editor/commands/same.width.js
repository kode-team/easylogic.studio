import { vertiesToRectangle } from "el/utils/collision";

export default {
    command : 'same.width',
    description: 'fit at the same width',
    execute: function (editor) {

        console.log(editor.selection.isMany);

        if (editor.selection.isMany) {
            const rect = vertiesToRectangle(editor.selection.verties);

            editor.command('setAttributeForMulti', 'fit at the same width', editor.selection.packByValue({
                x: rect.x,
                width: rect.width
            }))

        }
    }
}
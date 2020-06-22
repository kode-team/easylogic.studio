import _refreshSelection from "./_refreshSelection";

export default {
    command : 'item.move.depth.up',
    execute: function (editor) {
        const current = editor.selection.current; 

        if (current) {
            current.orderNext();
        }

        _refreshSelection(editor, true);
    }
}
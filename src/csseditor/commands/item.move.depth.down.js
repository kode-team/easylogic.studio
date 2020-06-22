import _refreshSelection from "./_refreshSelection";

export default {
    command : 'item.move.depth.down',
    execute: function (editor) {
        const current = editor.selection.current; 

        if (current) {
            current.orderPrev();
        }

        _refreshSelection(editor, true);
    }
}
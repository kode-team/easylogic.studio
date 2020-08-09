import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command : 'item.move.depth.up',
    execute: function (editor) {
        const current = editor.selection.current; 

        if (current) {
            current.orderNext();
        }

        _doForceRefreshSelection(editor, true);
    }
}
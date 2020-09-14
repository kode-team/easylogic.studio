import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command : 'item.move.up',
    execute: function (editor, obj = {dy: 1}) {
        const dy = +obj.dy;
        editor.selection.move(0, -1 * dy); 

        _doForceRefreshSelection(editor, true);
    }
}
import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command : 'item.move.down',
    execute: function (editor, obj = {dy: 1}) {
        const dy = +obj.dy;
        editor.selection.move(0, dy); 

        _doForceRefreshSelection(editor, true);
    }
}
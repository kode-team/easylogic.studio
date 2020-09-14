import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command : 'item.move.left',
    execute: function (editor, obj = {dx: 1}) {
        const dx = +obj.dx;
        editor.selection.move(-1 * dx , 0); 

        _doForceRefreshSelection(editor, true);
    }
}
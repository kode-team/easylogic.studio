import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command : 'item.move.right',
    execute: function (editor, obj = {dx: 1}) {
        const dx = +obj.dx;
        editor.selection.move(dx , 0); 

        _doForceRefreshSelection(editor, true);
    }
}
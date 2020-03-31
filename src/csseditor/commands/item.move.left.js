import _refreshSelection from "./_refreshSelection";

export default {
    command : 'item.move.left',
    execute: function (editor, obj = {dx: 1}) {
        const dx = +obj.dx;
        editor.selection.move(-1 * dx , 0); 
        editor.emit('refresh')

        _refreshSelection(editor, true);
    }
}
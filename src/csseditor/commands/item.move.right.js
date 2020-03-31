import _refreshSelection from "./_refreshSelection";

export default {
    command : 'item.move.right',
    execute: function (editor, obj = {dx: 1}) {
        const dx = +obj.dx;
        editor.selection.move(dx , 0); 
        editor.emit('refresh')

        _refreshSelection(editor, true);
    }
}
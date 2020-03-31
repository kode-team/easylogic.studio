import _refreshSelection from "./_refreshSelection";

export default {
    command : 'item.move.up',
    execute: function (editor, obj = {dy: 1}) {
        const dy = +obj.dy;
        editor.selection.move(0, -1 * dy); 
        editor.emit('refresh')

        _refreshSelection(editor, true);
    }
}
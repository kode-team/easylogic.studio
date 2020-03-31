import _refreshSelection from "./_refreshSelection";

export default {
    command : 'item.move.down',
    execute: function (editor, obj = {dy: 1}) {
        const dy = +obj.dy;
        editor.selection.move(0, dy); 
        editor.emit('refresh')

        _refreshSelection(editor, true);
    }
}
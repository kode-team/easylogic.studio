import _refreshSelection from "./_refreshSelection";

export default {
    command: 'addBackgroundColor',
    execute: function (editor, color, id = null) {
        var items = editor.selection.itemsByIds(id);
        items.forEach(item => {
            editor.emit('setAttribute', { 'background-color': color }, item.id)
        })

        _refreshSelection(editor, true);
    }
}
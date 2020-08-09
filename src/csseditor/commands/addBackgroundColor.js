import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command: 'addBackgroundColor',
    execute: function (editor, color, id = null) {
        var items = editor.selection.itemsByIds(id);
        items.forEach(item => {
            editor.emit('setAttribute', { 'background-color': color }, item.id)
        })

        _doForceRefreshSelection(editor, true);
    }
}
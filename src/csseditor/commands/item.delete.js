export default {
    command : 'item.delete',
    execute: function (editor, current) {
        editor.selection.remove()
        editor.emit('refreshAllSelectArtBoard')
    }
}
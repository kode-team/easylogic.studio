export default {
    command : 'item.delete',
    execute: function (editor) {
        editor.selection.remove()
        editor.emit('refreshArtboard')
    }
}
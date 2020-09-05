export default {
    command : 'removeLayer',
    execute: function (editor) {


        editor.selection.itemsByIds(editor.selection.ids).forEach(item => {
            item.remove();
        })

        editor.selection.empty();

        editor.emit('refreshArtboard')
    }
}
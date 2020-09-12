export default {
    command : 'removeLayer',
    execute: function (editor, ids = undefined) {

        // console.log(removeLayer);
        editor.selection.itemsByIds(ids || editor.selection.ids).forEach(item => {
            item.remove();
        })

        editor.selection.empty();

        editor.nextTick(() => {
            editor.emit('refreshAll')
        })

    }
}
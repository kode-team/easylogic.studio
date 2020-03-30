export default {
    command : 'clipboard.paste',
    execute : function (editor, obj) {
        if (editor.selection.length) {
            editor.selection.paste();
            editor.emit('refreshAll')
        }
    }
}
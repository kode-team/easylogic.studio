export default {
    command : 'paste',
    execute : function (editor) {
        editor.selection.paste();
        editor.emit('refreshAll')
    }
}
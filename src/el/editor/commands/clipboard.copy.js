export default {
    command : 'clipboard.copy',
    title: 'Copy',
    description : 'Copy',
    execute: function (editor, obj) {
        editor.selection.copy(10);
    }
}
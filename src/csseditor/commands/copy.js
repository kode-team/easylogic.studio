export default {
    command : 'copy',
    title: 'Copy',
    description : 'Copy',
    execute: function (editor) {
        editor.selection.copy();
    }
}
export default {
    command : 'history.redo',
    execute: function (editor) {
        editor.history.redo()
    }
}
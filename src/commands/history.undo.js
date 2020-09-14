export default {
    command : 'history.undo',
    execute: function (editor) {
        editor.history.undo()
    }
}
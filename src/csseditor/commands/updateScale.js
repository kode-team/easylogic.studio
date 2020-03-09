export default {
    command: 'updateScale',
    execute: function (editor, scale) {
        editor.scale = scale;
        editor.emit('changeScale')
    }

}
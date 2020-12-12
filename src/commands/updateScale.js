export default {
    command: 'updateScale',
    execute: function (editor, scale) {
        const oldScale = editor.scale; 
        editor.scale = scale;
        editor.resetWorldMatrix();
        editor.emit('changeScale', scale, oldScale)
    }

}
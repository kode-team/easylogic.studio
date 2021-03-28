import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command : 'scale.plus',
    execute: function (editor) {

        const oldScale = editor.viewport.scale;

        editor.viewport.setScale(editor.viewport.scale + 0.25)

        editor.emit('updateViewport', editor.viewport.scale, oldScale);
    }
}
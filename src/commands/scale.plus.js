import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command : 'scale.plus',
    execute: function (editor) {
        editor.emit('changeScaleValue', editor.scale + 0.25, editor.scale);
    }
}
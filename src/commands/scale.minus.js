import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command : 'scale.minus',
    execute: function (editor) {
        editor.emit('changeScaleValue', editor.scale - 0.25, editor.scale);
    }
}
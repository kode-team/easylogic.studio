import _refreshSelection from "./_refreshSelection";

export default {
    command : 'scale.minus',
    execute: function (editor) {
        editor.emit('changeScaleValue', editor.scale - 0.25);
    }
}
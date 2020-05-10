import _refreshSelection from "./_refreshSelection";

export default {
    command : 'scale.plus',
    execute: function (editor) {
        editor.emit('changeScaleValue', editor.scale + 0.25);
    }
}
import _refreshSelection from "./_refreshSelection"

export default {
    command: 'dropAsset',
    execute: function (editor, obj) {

        if (obj.color) {
            editor.emit('setAttribute', { 'background-color': obj.color })
        } else if (obj.gradient) {
            editor.emit('addBackgroundImageGradient', obj.gradient)
        }

        _refreshSelection(editor, true);

    }
}
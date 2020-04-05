import _refreshSelection from "./_refreshSelection"

export default {
    command: 'dropAsset',
    execute: function (editor, obj, id = null) {
        if (obj.color) {
            editor.emit('setAttribute', { 'background-color': obj.color }, id)
        } else if (obj.gradient) {
            editor.emit('addBackgroundImageGradient', obj.gradient, id)
        } else if (obj.imageUrl) {
            editor.emit('addBackgroundImageAsset', obj.imageUrl, id)
        }

        _refreshSelection(editor, true);

    }
}
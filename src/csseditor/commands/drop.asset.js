import _doForceRefreshSelection from "./_doForceRefreshSelection"

export default {
    command: 'drop.asset',
    execute: function (editor, obj, id = null) {

        if (obj.color) {
            editor.emit('addBackgroundColor', obj.color, id)            
        } else if (obj.gradient) {
            editor.emit('addBackgroundImageGradient', obj.gradient, id)
        } else if (obj.imageUrl) {
            editor.emit('addBackgroundImageAsset', obj.imageUrl, id)
        }

        _doForceRefreshSelection(editor, true);
    }
}
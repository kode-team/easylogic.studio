import _refreshSelection from "./_refreshSelection"
import loadOriginalImage from "../../editor/util/loadOriginalImage";

export default {
    command: 'dropAsset',
    execute: function (editor, obj) {

        if (obj.color) {
            editor.emit('setAttribute', { 'background-color': obj.color })
        } else if (obj.gradient) {
            editor.emit('addBackgroundImageGradient', obj.gradient)
        } else if (obj.imageUrl) {
            editor.emit('addBackgroundImageAsset', obj.imageUrl)
        }

        _refreshSelection(editor, true);

    }
}
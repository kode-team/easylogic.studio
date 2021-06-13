import _doForceRefreshSelection from "./_doForceRefreshSelection"

export default {
    command: 'drop.asset',
    execute: async function (editor, obj, id = null) {

        if (obj.color) {
            editor.emit('addBackgroundColor', obj.color, id)            
        } else if (obj.gradient) {
            editor.emit('addBackgroundImageGradient', obj.gradient, id)
        } else if (obj.pattern) {
            editor.emit('addBackgroundImagePattern', obj.pattern, id)            
        } else if (obj.imageUrl) {
            editor.emit('addBackgroundImageAsset', obj.imageUrl, id)
        } else if (obj.artboard) {

            const artboardData = await editor.storageManager.getArtBoard(obj.artboard.id);
            if (artboardData) {
                editor.emit('addArtBoard', artboardData, obj.artboard.center)
            }

        } else if (obj.customComponent) {

            const componentData = await editor.storageManager.getCustomComponent(obj.customComponent.id);
            if (componentData) {
                editor.emit('addArtBoard', componentData, obj.customComponent.center)
            }

        }

        _doForceRefreshSelection(editor, true);
    }
}
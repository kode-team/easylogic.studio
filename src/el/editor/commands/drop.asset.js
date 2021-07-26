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
        } else if (obj.asset) {

            const assetData = await editor.storageManager.getCustomAsset(obj.asset.id);
            if (assetData) {
                editor.emit('addArtBoard', assetData, obj.asset.center)
            }
        }

        _doForceRefreshSelection(editor, true);
    }
}
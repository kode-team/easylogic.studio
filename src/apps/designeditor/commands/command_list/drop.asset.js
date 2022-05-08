import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
  command: "drop.asset",
  execute: async function (editor, obj, id = null) {
    if (obj.color) {
      editor.context.commands.emit("addBackgroundColor", obj.color, id);
    } else if (obj.gradient) {
      editor.context.commands.emit(
        "addBackgroundImageGradient",
        obj.gradient,
        id
      );
    } else if (obj.pattern) {
      editor.context.commands.emit(
        "addBackgroundImagePattern",
        obj.pattern,
        id
      );
    } else if (obj.imageUrl) {
      editor.context.commands.emit("addBackgroundImageAsset", obj.imageUrl, id);
    } else if (obj.asset) {
      const assetData = await editor.storageManager.getCustomAsset(
        obj.asset.id
      );
      if (assetData) {
        editor.context.commands.emit(
          "addArtBoard",
          assetData,
          obj.asset.center
        );
      }
    }

    _doForceRefreshSelection(editor, true);
  },
};

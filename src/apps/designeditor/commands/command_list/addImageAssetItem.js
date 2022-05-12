import loadOriginalImage from "elf/editor/util/loadOriginalImage";

export default {
  command: "addImageAssetItem",
  execute: function (
    editor,
    imageObject,
    rect = {},
    containerItem = undefined
  ) {
    var project = editor.context.selection.currentProject;

    if (project) {
      // append image asset
      project.createImage(imageObject);
      editor.context.commands.emit("addImageAsset");

      // convert data or blob to local url
      loadOriginalImage(imageObject, (info) => {
        // width 랑 같은 비율로 맞추기
        const rate = rect.width / info.width;
        const width = rect.width;
        const height = info.height * rate;

        editor.context.commands.emit(
          "addImage",
          {
            src: imageObject.id,
            ...info,
            ...rect,
            width,
            height,
          },
          containerItem
        );
      });
    }
  },
};

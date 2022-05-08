import { uuidShort } from "elf/core/math";

export default {
  command: "updateImage",
  execute: function (editor, imageFileOrBlob, rect, containerItem) {
    var reader = new window.FileReader();
    reader.onload = (e) => {
      var datauri = e.target.result;
      var local = window.URL.createObjectURL(imageFileOrBlob);

      editor.context.commands.emit(
        "addImageAssetItem",
        {
          id: uuidShort(),
          type: imageFileOrBlob.type,
          name: imageFileOrBlob.name,
          original: datauri,
          local,
        },
        rect,
        containerItem
      );
    };

    reader.readAsDataURL(imageFileOrBlob);
  },
};

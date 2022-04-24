import { uuidShort } from "elf/utils/math";

export default {
  command: "updateVideo",
  execute: function (editor, item, rect, containerItem = undefined) {
    var reader = new window.FileReader();
    reader.onload = (e) => {
      var datauri = e.target.result;
      var local = window.URL.createObjectURL(item);

      editor.emit(
        "addVideoAssetItem",
        {
          id: uuidShort(),
          type: item.type,
          name: item.name,
          original: datauri,
          local,
        },
        rect,
        containerItem
      );
    };

    reader.readAsDataURL(item);
  },
};

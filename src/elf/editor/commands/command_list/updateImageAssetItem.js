import { uuidShort } from "elf/utils/math";
import { isFunction } from "sapa";

export default {
  command: "updateImageAssetItem",
  execute: function (editor, item, callback) {
    var reader = new window.FileReader();
    reader.onload = (e) => {
      var datauri = e.target.result;
      var local = window.URL.createObjectURL(item);

      var project = editor.selection.currentProject;

      if (project) {
        // append image asset
        const image = project.createImage({
          id: uuidShort(),
          type: item.type,
          name: item.name,
          original: datauri,
          local,
        });
        editor.emit("addImageAsset");
        isFunction(callback) && callback(image.id);
      }
    };

    reader.readAsDataURL(item);
  },
};

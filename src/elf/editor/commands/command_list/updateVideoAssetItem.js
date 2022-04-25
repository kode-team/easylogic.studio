import { isFunction } from "sapa";

import { uuidShort } from "elf/core/math";

export default {
  command: "updateVideoAssetItem",
  execute: function (editor, item, callback) {
    var reader = new window.FileReader();
    reader.onload = (e) => {
      var datauri = e.target.result;
      var local = window.URL.createObjectURL(item);

      var project = editor.selection.currentProject;

      if (project) {
        // append image asset
        project.createVideo({
          id: uuidShort(),
          type: item.type,
          name: item.name,
          original: datauri,
          local,
        });
        editor.emit("addVideoAsset");
        isFunction(callback) && callback(local);
      }
    };

    reader.readAsDataURL(item);
  },
};

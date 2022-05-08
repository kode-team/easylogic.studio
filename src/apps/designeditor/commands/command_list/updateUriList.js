import { uuidShort } from "elf/core/math";
import { AssetParser } from "elf/core/parser/AssetParser";

export default {
  command: "updateUriList",
  execute: function (editor, item) {
    var datauri = item.data;
    if (datauri.indexOf("data:") > -1) {
      var info = AssetParser.parse(datauri, true);

      // datauri 그대로 정의 될 때
      switch (info.mimeType) {
        case "image/png":
        case "image/gif":
        case "image/jpg":
        case "image/jpeg":
          editor.context.commands.emit("addImageAssetItem", {
            id: uuidShort(),
            type: info.mimeType,
            name: "",
            original: datauri,
            local: info.local,
          });
          break;
      }
    } else {
      // url 로 정의 될 때
      var ext = item.data.split(".").pop();
      var name = item.data.split("/").pop();

      switch (ext) {
        case "png":
        case "jpg":
        case "gif":
        case "svg":
          editor.context.commands.emit("addImageAssetItem", {
            id: uuidShort(),
            type: "image/" + ext,
            name,
            original: item.data,
            local: item.data,
          });
          break;
      }
    }
  },
};

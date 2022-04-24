import downloadFile from "elf/editor/util/downloadFile";

export default {
  command: "downloadJSON",
  execute: function (editor, filename) {
    var json = JSON.stringify(editor.modelManager.toJSON());

    var datauri =
      "data:application/json;base64," +
      window.btoa(unescape(encodeURIComponent(json)));

    downloadFile(datauri, filename || "elf.json");
  },
};

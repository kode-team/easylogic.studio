export default {
  command: "showExportView",
  execute: function (editor) {
    editor.emit("showExportWindow");
  },
};

export default {
  command: "recoverCursor",
  execute: function (editor) {
    editor.emit("changeIconView", "auto");
  },
};

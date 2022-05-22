export default {
  command: "select.none",
  execute: function (editor) {
    editor.context.selection.empty();
    editor.context.commands.emit("history.refreshSelection");
  },
};

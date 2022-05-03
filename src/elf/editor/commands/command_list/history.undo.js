export default {
  command: "history.undo",
  execute: function (editor) {
    editor.context.history.undo();
  },
};

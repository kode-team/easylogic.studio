export default {
  command: "recoverCursor",
  execute: function (editor) {
    editor.context.config.set("editor.cursor", "auto");
    editor.context.config.set("editor.cursor.args", []);
  },
};

export default {
  command: "refreshCursor",
  execute: function (editor, iconType, ...args) {
    editor.context.config.set("editor.cursor", iconType);
    editor.context.config.set("editor.cursor.args", args);
  },
};

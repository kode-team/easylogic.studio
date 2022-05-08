export default {
  command: "fileDropItems",
  execute: function (editor, items = []) {
    editor.context.commands.emit("updateResource", items);
  },
};

export default {
  command: "fileDropItems",
  execute: function (editor, items = []) {
    editor.emit("updateResource", items);
  },
};

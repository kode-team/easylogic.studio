export default {
  command: "select.all",
  execute: function (editor) {
    var project = editor.context.selection.currentProject;
    if (project) {
      editor.context.selection.select(...project.layers);
      editor.emit("history.refreshSelection");
    }
  },
};

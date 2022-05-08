export default {
  command: "removeTimeline",
  execute: function (editor, layerId) {
    const project = editor.context.selection.currentProject;

    if (project) {
      project.removeTimeline(layerId);

      editor.timeline.empty();
      editor.emit("refreshTimeline");
      editor.emit("refreshSelectedOffset");
    }
  },
};

export default {
  command: "removeTimelineProperty",
  execute: function (editor, layerId, property) {
    const project = editor.context.selection.currentProject;
    if (project) {
      project.removeTimelineProperty(layerId, property);

      editor.timeline.empty();
      editor.emit("refreshTimeline");
      editor.emit("refreshSelectedOffset");
    }
  },
};

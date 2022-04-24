import _currentProject from "./_currentProject";

export default {
  command: "addTimelineItem",
  execute: function (editor, layerId) {
    _currentProject(editor, (project) => {
      if (layerId) {
        project.addTimelineLayer(layerId);
      } else {
        project.addTimeline();
      }
      editor.emit("refreshTimeline");
      editor.emit("addTimeline");
    });
  },
};

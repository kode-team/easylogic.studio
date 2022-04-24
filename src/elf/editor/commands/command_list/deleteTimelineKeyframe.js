import _currentProject from "./_currentProject";

export default {
  command: "deleteTimelineKeyframe",
  execute: function (editor) {
    _currentProject(editor, (project) => {
      editor.timeline.each((item) => {
        project.deleteTimelineKeyframe(item.layerId, item.property, item.id);
      });

      editor.timeline.empty();
      editor.emit("refreshTimeline");
      editor.emit("refreshSelectedOffset");
    });
  },
};

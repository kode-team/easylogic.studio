import _currentProject from "./_currentProject";

export default {
  command: "copyTimelineProperty",
  execute: function (editor, layerId, property, newTime = null) {
    _currentProject(editor, (project) => {
      project.copyTimelineKeyframe(layerId, property, newTime);

      editor.emit("refreshTimeline");
    });
  },
};

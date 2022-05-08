export default {
  command: "setTimelineOffset",
  debounce: 100,
  execute: function (editor, obj) {
    const project = editor.context.selection.currentProject;
    if (project) {
      project.setTimelineKeyframeOffsetValue(
        obj.layerId,
        obj.property,
        obj.id,
        obj.value,
        obj.timing,
        obj.time
      );
      editor.emit("refreshTimeline");
    }
  },
};

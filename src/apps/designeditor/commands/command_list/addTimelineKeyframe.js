import _currentProject from "./_currentProject";

export default {
  command: "addTimelineKeyframe",
  execute: function (editor, options = { timing: "linear" }) {
    _currentProject(editor, (project) => {
      var item = editor.context.modelManager.get(options.layerId);

      var keyframeObj = {
        layerId: options.layerId,
        property: options.property,
        time: options.time,
        value: item[options.property] + "",
        timing: options.timing,
        editor: options.editor,
      };
      var obj = project.addTimelineKeyframe(keyframeObj);
      editor.timeline.select(obj);
      editor.emit("refreshTimeline");
      editor.emit("refreshSelectedOffset");
    });
  },
};

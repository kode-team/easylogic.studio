import _currentProject from "./_currentProject";

export default {
  command: "addTimelineCurrentProperty",
  execute: function (editor, options = { timing: "linear" }) {
    _currentProject(editor, (project) => {
      var list = [];
      editor.context.selection.each((item) => {
        var keyframeObj = {
          layerId: item.id,
          property: options.property,
          value: item[options.property] + "",
          timing: options.timing,
          editor: options.editor,
        };

        var obj = project.addTimelineKeyframe(keyframeObj);

        if (obj) {
          list.push(obj);
        }
      });

      editor.context.timeline.select(...list);
      editor.emit("refreshTimeline");
      editor.emit("refreshSelectedOffset");
    });
  },
};

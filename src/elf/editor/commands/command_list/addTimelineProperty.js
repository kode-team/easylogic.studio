import _currentProject from "./_currentProject";

export default {
  command: "addTimelineProperty",
  execute: function (editor, layerList, options = { timing: "linear" }) {
    _currentProject(editor, (project) => {
      if (Array.isArray(layerList) === false) {
        layerList = [layerList];
      }

      var list = [];
      layerList.forEach((layerId) => {
        var keyframeObj = {
          layerId: layerId,
          property: options.property,
          value: options.value + "",
          timing: options.timing,
          editor: options.editor,
        };
        var obj = project.addTimelineKeyframe(keyframeObj);

        if (obj) {
          list.push(obj);
        }
      });

      editor.timeline.select(...list);

      editor.emit("refreshTimeline");
      editor.emit("refreshSelectedOffset");
    });
  },
};

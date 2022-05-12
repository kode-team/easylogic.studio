export default {
  command: "refreshSelectedOffset",
  execute: function (editor) {
    var offset = editor.timeline.items[0];
    if (offset) {
      editor.emit("refreshOffsetValue", offset);
    }
  },
};

export default {
  command: "segment.delete",
  execute: function (editor) {
    editor.emit("deleteSegment");
  },
};

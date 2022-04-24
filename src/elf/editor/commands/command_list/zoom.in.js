export default {
  command: "zoom.in",
  execute: function (editor) {
    editor.viewport.zoomIn(0.02);
  },
};

export default {
  command: "zoom.in",
  execute: function (editor) {
    editor.context.viewport.zoomIn(0.02);
  },
};

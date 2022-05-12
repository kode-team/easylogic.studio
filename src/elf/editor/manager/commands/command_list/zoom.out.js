export default {
  command: "zoom.out",
  execute: function (editor) {
    editor.context.viewport.zoomOut(0.02);
  },
};

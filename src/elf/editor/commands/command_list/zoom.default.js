export default {
  command: "zoom.default",
  execute: function (editor) {
    editor.context.viewport.zoomDefault();
  },
};

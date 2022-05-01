export default {
  command: "push.mode.view",
  execute: function (editor, modeView = "CanvasView") {
    editor.context.modeViewManager.pushMode(modeView);
    editor.emit("updateModeView");
  },
};

export default {
  command: "pop.mode.view",
  execute: function (editor, modeView = undefined) {
    editor.context.modeViewManager.popMode(modeView);
  },
};

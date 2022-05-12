import { ViewModeType } from "elf/editor/types/editor";
export default {
  command: "push.mode.view",
  execute: function (editor, modeView = ViewModeType.CanvasView) {
    editor.context.modeViewManager.pushMode(modeView);
    editor.emit("updateModeView");
  },
};

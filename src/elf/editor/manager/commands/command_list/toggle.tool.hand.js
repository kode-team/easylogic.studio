import { EditingMode } from "elf/editor/types/editor";

/**
 *
 * @param {Editor} editor
 */
export default {
  command: "toggleToolHand",
  execute: function (editor) {
    if (editor.context.config.is("editing.mode", EditingMode.HAND)) {
      editor.context.config.set("editing.mode", EditingMode.SELECT);
    } else {
      editor.context.config.set("editing.mode", EditingMode.HAND);
    }

    editor.emit("hideLayerAppendView");
  },
};

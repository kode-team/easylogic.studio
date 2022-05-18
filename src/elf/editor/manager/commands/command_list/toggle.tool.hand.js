import { EditingMode } from "elf/editor/types/editor";

/**
 *
 * @param {Editor} editor
 */
export default {
  command: "toggleToolHand",
  execute: function (editor) {
    editor.context.config.toggleWith(
      "editing.mode",
      EditingMode.SELECT,
      EditingMode.HAND
    );
  },
};

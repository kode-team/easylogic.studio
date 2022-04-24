/**
 *
 * @param {Editor} editor
 */
export default {
  command: "toggleToolHand",
  execute: function (editor) {
    editor.config.toggle("set.tool.hand");
  },
};

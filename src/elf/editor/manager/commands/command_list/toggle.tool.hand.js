/**
 *
 * @param {Editor} editor
 */
export default {
  command: "toggleToolHand",
  execute: function (editor) {
    editor.context.config.toggle("set.tool.hand");
  },
};

export default {
  command: "rotateLayer",

  description: "rotate layer by keydown with matrix ",
  /**
   *
   * @param {Editor} editor
   * @param {number} dx
   * @param {number} dy
   */
  execute: function (editor, distAngle = 0) {
    editor.command(
      "setAttributeForMulti",
      "change rotate",
      editor.context.selection.packByValue({
        angle: editor.context.selection.current.angle + distAngle,
      })
    );
  },
};

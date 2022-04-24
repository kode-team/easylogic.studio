export default {
  command: "moveLayer",

  description: "move layer by keydown with matrix ",
  /**
   *
   * @param {Editor} editor
   * @param {number} dx
   * @param {number} dy
   */
  execute: function (editor, dx = 0, dy = 0) {
    const absoluteDist = [dx, dy, 0];
    editor.selection.items.forEach((it) => {
      it.absoluteMove(absoluteDist);
    });

    editor.command(
      "setAttributeForMulti",
      "item move down",
      editor.selection.pack("x", "y")
    );

    editor.nextTick(() => {
      editor.selection.reselect();
    });
  },
};

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
    editor.context.selection.items.forEach((it) => {
      it.absoluteMove(absoluteDist);
    });

    editor.context.commands.executeCommand(
      "setAttribute",
      "item move down",
      editor.context.selection.pack("x", "y")
    );

    editor.nextTick(() => {
      editor.context.selection.reselect();
    });
  },
};

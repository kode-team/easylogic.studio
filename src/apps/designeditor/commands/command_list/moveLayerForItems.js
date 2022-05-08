export default {
  command: "moveLayerForItems",

  description: "mova layer by multi items ",
  /**
   *
   * @param {Editor} editor
   * @param {number} dx
   * @param {number} dy
   */
  execute: function (editor, moveItems = []) {
    const itemsMap = {};

    moveItems.forEach((it) => {
      it.item.absoluteMove(it.dist);

      itemsMap[it.item.id] = it.item.attrs("x", "y");
    });

    editor.context.commands.emit("history.setAttribute", "item move", itemsMap);

    editor.nextTick(() => {
      editor.context.selection.reselect();
    });
  },
};

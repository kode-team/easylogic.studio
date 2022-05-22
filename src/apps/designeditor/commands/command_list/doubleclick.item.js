export default {
  command: "doubleclick.item",
  execute: function (editor, evt, id) {
    const item = editor.get(id);

    if (editor.context.selection.isOne && item) {
      if (editor.context.selection.checkChildren(item.id)) {
        editor.context.selection.select(item);
      } else {
        if (editor.context.selection.check(item)) {
          editor.context.commands.emit("open.editor");
          editor.emit("removeGuideLine");
        } else {
          this.selectInWorldPosition(editor, evt, item);
        }
      }
    } else {
      this.selectInWorldPosition(editor, evt, item);
    }
  },

  selectInWorldPosition: function (editor, evt, item) {
    const point = editor.context.viewport.getWorldPosition(evt);
    if (
      editor.context.selection.hasPoint(point) ||
      editor.context.selection.hasChildrenPoint(point)
    ) {
      editor.context.selection.select(item);
      editor.snapManager.clear();
    }
  },
};

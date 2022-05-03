import { REFRESH_SELECTION, REFRESH_SELECTION_TOOL } from "../../types/event";
export default {
  command: "doubleclick.item",
  execute: function (editor, evt, id) {
    const item = editor.get(id);

    if (editor.context.selection.isOne && item) {
      if (editor.context.selection.checkChildren(item.id)) {
        editor.context.selection.select(item);
        editor.emit(REFRESH_SELECTION);
        editor.emit(REFRESH_SELECTION_TOOL);
      } else {
        if (editor.context.selection.check(item)) {
          editor.emit("open.editor");
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
      editor.emit(REFRESH_SELECTION_TOOL, true);
      editor.emit("history.refreshSelection");
    }
  },
};

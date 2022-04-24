export default {
  command: "history.setAttributeForMulti",
  execute: function (
    editor,
    message,
    multiAttrs = {},
    context = { origin: "*" }
  ) {
    editor.emit("setAttributeForMulti", multiAttrs, context);

    editor.history.add(message, this, {
      currentValues: [multiAttrs],
      undoValues: editor.history.getUndoValuesForMulti(multiAttrs),
    });

    editor.nextTick(() => {
      editor.history.saveSelection();
    });
  },

  redo: function (editor, { currentValues }) {
    editor.emit("setAttributeForMulti", ...currentValues);
    editor.nextTick(() => {
      editor.selection.reselect();
      editor.emit("refreshAll");
    });
  },

  undo: function (editor, { undoValues }) {
    const ids = Object.keys(undoValues);
    const items = editor.selection.itemsByIds(ids);

    items.forEach((item) => {
      item.reset(undoValues[item.id]);
    });
    editor.selection.reselect();

    editor.nextTick(() => {
      editor.emit("refreshAll");
    });
  },
};

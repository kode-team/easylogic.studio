export default {
  command: "history.setAttribute",
  execute: function (
    editor,
    message,
    multiAttrs = {},
    context = { origin: "*" }
  ) {
    editor.context.commands.emit("setAttribute", multiAttrs, context);

    editor.context.history.add(message, this, {
      currentValues: [multiAttrs],
      undoValues: editor.context.history.getUndoValues(multiAttrs),
    });

    editor.nextTick(() => {
      editor.context.history.saveSelection();
    });
  },

  redo: function (editor, { currentValues }) {
    editor.context.commands.emit("setAttribute", ...currentValues);
    editor.nextTick(() => {
      editor.context.selection.reselect();
      editor.emit("refreshAll");
    });
  },

  undo: function (editor, { undoValues }) {
    const ids = Object.keys(undoValues);
    const items = editor.context.selection.itemsByIds(ids);

    items.forEach((item) => {
      item.reset(undoValues[item.id]);
    });
    editor.context.selection.reselect();

    editor.nextTick(() => {
      editor.emit("refreshAll");
    });
  },
};

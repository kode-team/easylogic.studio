import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
  command: "item.move.depth.last",
  execute: function (editor) {
    const current = editor.context.selection.current;

    if (current) {
      current.orderLast();
    }

    _doForceRefreshSelection(editor, true);
  },
};

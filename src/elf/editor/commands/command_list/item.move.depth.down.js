import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
  command: "item.move.depth.down",
  execute: function (editor) {
    const current = editor.context.selection.current;

    if (current) {
      current.orderPrev();
    }

    _doForceRefreshSelection(editor, true);
  },
};

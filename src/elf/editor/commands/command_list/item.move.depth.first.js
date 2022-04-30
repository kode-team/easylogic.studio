import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
  command: "item.move.depth.first",
  execute: function (editor) {
    // TODO: 히스토리 적용해야함
    // TODO: 총 3가지가 동시에 바뀌게 되는데   1: 현재 부모, 2: 이전 부모의 자식 리스트, 3: 현재 부모의 자식 리스트
    const current = editor.context.selection.current;

    if (current) {
      current.orderFirst();
    }

    _doForceRefreshSelection(editor, true);
  },
};

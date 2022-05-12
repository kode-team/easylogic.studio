/**
 * Item 리스트에서 포함된 자식을 제거한다.
 *
 * 제거하는 방법은  상속관계 id 리스트를구한 다음에 ,
 *
 * item 리스트에서 부모와 자식 관계가 동시에 존재하는 경우 자식이라고 인지하고 필터링 한다.
 *
 * @param {Item[]} items
 */
function filterChildren(items = []) {
  // items 중에  자식/부모의 관게의 객체가 있으면 자식은 필터링 한다.
  return items.filter((item) => {
    let total = 0;
    item.path.forEach((treeItem) => {
      total += items.filter((it) => it.id === treeItem.id).length ? 1 : 0;
    });

    return total === 1;
  });
}

export default {
  command: "history.removeLayer",
  description: "remove layer",

  /**
   * 객체를 삭제 한다. 삭제 할 때 history 도 남긴다.
   *
   * @param {Editor} editor
   * @param {string} message
   * @param {string[]|undefined} ids
   */
  execute: function (editor, message, ids = undefined) {
    // // 지우기 전 객체를 모두 clone 한다.
    let items = editor.context.selection.itemsByIds(
      ids || editor.context.selection.ids
    );

    // items 중에  자식/부모의 관게의 객체가 있으면 자식은 필터링 한다.
    items = filterChildren(items);

    const filtedIds = items.map((it) => it.id);

    // 삭제 할 때는 modelManager 에서 mark 를 한다.
    editor.context.modelManager.markRemove(filtedIds);

    //전체 삭제
    const parentIds = items.map((it) => it.parentId);

    items.forEach((item) => {
      item.remove();
      editor.context.selection.removeById(item.id);
    });

    editor.context.history.add(message, this, {
      currentValues: [filtedIds, parentIds],
      undoValues: filtedIds,
    });

    editor.nextTick(() => {
      editor.context.selection.removeById(filtedIds);

      parentIds.forEach((parentId) => {
        editor.context.commands.emit("update", parentId, {
          changedChildren: true,
        });
      });

      editor.emit("refreshAll");
      editor.emit("removeGuideLine");

      editor.nextTick(() => {
        editor.context.history.saveSelection();
      });
    });
  },

  redo: function (editor, { currentValues }) {
    const ids = currentValues[0];
    let items = editor.context.selection.itemsByIds(
      ids || editor.context.selection.ids
    );

    // items 중에  자식/부모의 관게의 객체가 있으면 자식은 필터링 한다.
    items = filterChildren(items);

    // 삭제 할 때는 modelManager 에서 mark 를 한다.
    editor.context.modelManager.markRemove(items.map((it) => it.id));

    //전체 삭제
    items.forEach((item) => item.remove());

    editor.nextTick(() => {
      editor.emit("refreshAll");
    });
  },

  /**
   * 생성된 undoValues 를 복구한다.
   * 복구 할 때는 해당 객체의 부모와 위치를 같이 복구한다.
   *
   * @param {Editor} editor
   * @param {Object} param1
   * @param {string} param1.undoValues  JSON serialize 된 문자열
   */
  undo: function (editor, { undoValues: recoverIds }) {
    editor.context.modelManager.unmarkRemove(recoverIds);

    editor.nextTick(() => {
      editor.emit("refreshAll");
    });
  },
};

import { isArrayEquals } from "elf/core/func";

export default {
  command: "history.group.item",
  description: "History Group Item",
  execute: function (editor, message = "selection") {
    const currentValues = editor.context.selection.ids;
    const projectId = editor.context.selection.currentProject?.id;
    const undoValues = editor.context.history.selectedIds;

    // 이전 선택과 같으면 선택 히스토리는 쌓지 않는다.
    if (isArrayEquals(currentValues, undoValues)) {
      return;
    }

    // group 을 구성할 items 리스트 구하기
    // items 을 구할 때  {id, parentId, noInChildren} 의 리스트를 미리 가지고 있는다.
    // group 을 구성할 rect를 전체 영역으로 하나 만들기
    // rect 에 items 모두 넣기
    // rect 선택하기
    editor.context.history.add(message, this, {
      currentValues: {
        ids: currentValues,
        projectId: projectId,
      },
      undoValues: {
        ids: undoValues,
        projectId: projectId,
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  redo: function (editor, { currentValues: [ids, projectId] }) {
    // group 을 구성할 items 리스트 구하기
    // group 을 구성할 rect 하나 만들기
    // rect 에 items 모두 넣기
    // rect 선택하기
  },
  // eslint-disable-next-line no-unused-vars
  undo: function (editor, { undoValues: [ids, projectId] }) {
    // group 을 구성한 items 리스트에서 원래 부모로 되돌리기
    // 기존 group을 구성한 selection 원래대로 맞추기
    // project selection 원래대로 맞추기
  },
};

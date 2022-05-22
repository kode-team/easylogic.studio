import { isArrayEquals } from "elf/core/func";
// import { REFRESH_SELECTION } from "elf/editor/types/event";

export default {
  command: "history.refreshSelection",
  description: `save selection in history `,
  description_ko: "Selection 정보를 갱신하면서 History 에 저장한다",
  execute: function (editor, message = "selection") {
    const currentValues = editor.context.selection.ids;
    const projectId = editor.context.selection.currentProject?.id;
    const undoValues = editor.context.history.selectedIds;

    // 이전 선택과 같으면 선택 히스토리는 쌓지 않는다.
    if (isArrayEquals(currentValues, undoValues)) {
      return;
    }

    editor.context.history.add(message, this, {
      currentValues: [currentValues, projectId],
      undoValues: [undoValues, projectId],
    });

    this.nextAction(editor);
  },

  nextAction(editor) {
    editor.nextTick(() => {
      editor.context.history.saveSelection();
      // editor.emit(REFRESH_SELECTION);
    });
  },

  redo: function (editor, { currentValues: [ids, projectId] }) {
    editor.context.selection.selectProject(projectId);
    editor.context.selection.select(...ids);

    this.nextAction(editor);
  },
  undo: function (editor, { undoValues: [ids, projectId] }) {
    editor.context.selection.selectProject(projectId);
    editor.context.selection.select(...ids);

    this.nextAction(editor);
  },
};

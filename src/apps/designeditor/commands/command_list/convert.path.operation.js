import { REFRESH_SELECTION } from "elf/editor/types/event";

export default {
  command: "convert.path.operation",
  description: "apply path boolean operation",
  execute: (editor, booleanOperation) => {
    const current = editor.context.selection.current;

    if (!current) return;

    const changeBooleanOperation = (booleanOperation) => {
      editor.context.commands.executeCommand(
        "setAttribute",
        "change boolean operation",
        editor.context.selection.packByValue({
          booleanOperation: booleanOperation,
        })
      );

      recoverBooleanPath();
    };

    const recoverBooleanPath = () => {
      editor.nextTick(() => {
        // path operation 을 적용 후 container 의 크기를 재구성한다.
        editor.context.commands.emit("recoverBooleanPath");

        editor.nextTick(() => {
          editor.emit(REFRESH_SELECTION);
          // editor.emit('refreshSelectionTool');
        });
      });
    };

    if (current.is("boolean-path") || current.isBooleanItem) {
      let parent = current;

      if (current.isBooleanItem) {
        parent = current.parent;
      }

      // boolean operation 을 적용할 레이어를 먼저 선택한다.
      editor.context.selection.select(parent);

      changeBooleanOperation(booleanOperation);
    } else {
      if (editor.context.selection.current?.isNot("boolean-path")) {
        editor.context.commands.emit("group.item", {
          itemType: "boolean-path",
          title: "Intersection",
        });
      }

      editor.nextTick(() => {
        if (editor.context.selection.current?.is("boolean-path")) {
          changeBooleanOperation(booleanOperation);
        }
      }, 10);
    }
  },
};

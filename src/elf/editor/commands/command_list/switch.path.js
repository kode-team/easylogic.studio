import { REFRESH_SELECTION } from "../../types/event";

export default {
  command: "switch.path",
  execute: async (editor) => {
    const current = editor.context.selection.current;

    if (!current) return;

    if (current.is("boolean-path") || current.isBooleanItem) {
      let parent = current;

      if (current.isBooleanItem) {
        parent = current.parent;
      }

      editor.context.selection.select(parent);

      editor.command(
        "setAttributeForMulti",
        "change boolean operation",
        editor.context.selection.packByValue({
          // reverse children
          "boolean-operation": parent["boolean-operation"],
          children: parent.children.reverse(),
        })
      );

      editor.nextTick(() => {
        editor.emit("recoverBooleanPath");

        editor.context.selection.select(current);
        editor.emit(REFRESH_SELECTION);
      });
    }
  },
};

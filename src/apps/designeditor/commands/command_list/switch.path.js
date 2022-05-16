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

      editor.context.commands.executeCommand(
        "setAttribute",
        "change boolean operation",
        editor.context.selection.packByValue({
          // reverse children
          booleanOperation: parent["boolean-operation"],
          children: parent.children.reverse(),
        })
      );

      editor.nextTick(() => {
        editor.context.commands.emit("recoverBooleanPath");

        editor.context.selection.select(current);
      });
    }
  },
};

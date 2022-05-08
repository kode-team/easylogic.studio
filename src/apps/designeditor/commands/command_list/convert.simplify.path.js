export default {
  command: "convert.simplify.path",
  execute: (editor) => {
    const current = editor.context.selection.current;

    if (!current) return;

    editor.context.commands.executeCommand(
      "setAttribute",
      "change path string",
      editor.context.selection.packByValue(
        current.updatePath(editor.pathKitManager.simplify(current.d))
      )
    );
  },
};

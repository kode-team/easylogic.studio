export default {
  command: "addBackgroundColor",
  execute: function (editor, color, id = null) {
    editor.context.commands.executeCommand(
      "setAttribute",
      "add background color",
      editor.context.selection.packByValue(
        {
          backgroundColor: color,
        },
        id
      )
    );
  },
};

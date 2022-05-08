export default {
  command: "addBackgroundColor",
  execute: function (editor, color, id = null) {
    editor.context.commands.executeCommand(
      "setAttribute",
      "add background color",
      editor.context.selection.packByValue(
        {
          "background-color": color,
        },
        id
      )
    );
  },
};

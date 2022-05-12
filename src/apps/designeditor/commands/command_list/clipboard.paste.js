export default {
  command: "clipboard.paste",

  execute: async function (editor) {
    /** todo : support history */
    if (!editor.clipboard.isEmpty) {
      editor.context.commands.emit("history.clipboard.paste", "paste");
    } else {
      var text = await window.navigator.clipboard.readText();

      if (text) {
        editor.context.commands.emit("convertPasteText", text);
      }
    }
  },
};

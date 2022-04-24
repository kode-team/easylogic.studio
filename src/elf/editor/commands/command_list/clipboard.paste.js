export default {
  command: "clipboard.paste",

  execute: async function (editor) {
    /** todo : support history */
    if (!editor.clipboard.isEmpty) {
      editor.emit("history.clipboard.paste", "paste");
    } else {
      var text = await window.navigator.clipboard.readText();

      if (text) {
        editor.emit("convertPasteText", text);
      }
    }
  },
};

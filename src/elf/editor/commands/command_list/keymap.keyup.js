export default {
  command: "keymap.keyup",
  execute: function (editor, e) {
    editor.keyboardManager.remove(e.key, e.keyCode);

    if (editor.shortcuts) {
      editor.shortcuts.execute(e, "keyup");
    }
  },
};

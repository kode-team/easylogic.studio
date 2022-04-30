export default {
  command: "keymap.keyup",
  execute: function (editor, e) {
    editor.context.keyboardManager.remove(e.key, e.keyCode);

    if (editor.context.shortcuts) {
      editor.context.shortcuts.execute(e, "keyup");
    }
  },
};

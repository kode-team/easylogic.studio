export default {
  command: "keymap.keydown",
  execute: function (editor, e) {
    editor.context.keyboardManager.add(e.code, e.keyCode, e);

    if (editor.context.shortcuts) {
      editor.context.shortcuts.execute(e, "keydown");
    }
  },
};

export default {
  command: "setLocale",
  execute: function (editor, locale) {
    editor.setLocale(locale);
    editor.emit("changed.locale");
  },
};

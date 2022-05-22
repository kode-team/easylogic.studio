export default {
  command: "update",
  description: "Update the model",

  /**
   *
   * @param {Editor} editor
   * @param {*} id
   * @param {*} attrs
   * @param {*} context
   */
  execute: function (editor, id = null, attrs = {}, context = { origin: "*" }) {
    const item = editor.get(id);

    if (item) {
      const isChanged = item.reset(attrs, context);

      if (isChanged) {
        editor.context.commands.emit("refreshElement", item);
      }
    }
  },
};

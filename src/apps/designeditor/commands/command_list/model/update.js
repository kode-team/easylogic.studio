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

    console.log(item);

    if (item) {
      const isChanged = item.reset(attrs, context);

      console.log(item, attrs, isChanged);

      if (isChanged) {
        editor.context.commands.emit("refreshElement", item);
      }
    }
  },
};

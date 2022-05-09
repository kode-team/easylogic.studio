export default {
  command: "removeLayer",
  execute: function (editor, ids = undefined) {
    // console.log(removeLayer);
    const currentIds = ids || editor.context.selection.ids;
    const removedIds = [];
    editor.context.selection.itemsByIds(currentIds).forEach((item) => {
      removedIds.push(item.id);
      item.remove();
    });

    editor.context.selection.removeById(removedIds);

    editor.nextTick(() => {
      editor.emit("refreshAll");
    });
  },
};

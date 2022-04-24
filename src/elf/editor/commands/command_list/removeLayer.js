export default {
  command: "removeLayer",
  execute: function (editor, ids = undefined) {
    // console.log(removeLayer);
    const currentIds = ids || editor.selection.ids;
    const removedIds = [];
    editor.selection.itemsByIds(currentIds).forEach((item) => {
      removedIds.push(item.id);
      item.remove();
    });

    editor.selection.removeById(removedIds);

    editor.nextTick(() => {
      editor.emit("refreshAll");
    });
  },
};

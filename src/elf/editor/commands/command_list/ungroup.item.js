export default {
  command: "ungroup.item",
  execute: function (editor) {
    if (editor.context.selection.length === 0) return;

    const current = editor.context.selection.current;

    if (current) {
      let groupLayer = current;
      let layers = [...groupLayer.layers];

      layers.reverse();

      layers.forEach((child) => {
        groupLayer.insertBefore(child);
      });

      editor.context.selection.select(...layers);
      editor.emit("refreshAll");
    }
  },
};

export default {
  command: "refreshArtboard",
  execute: function (editor) {
    const command = editor.createCommandMaker();

    command.emit("refreshLayerTreeView");
    command.emit("refreshAllCanvas");
    command.emit("refreshStyleView");
    command.emit("refreshSelectionStyleView");
    command.emit("refreshAllElementBoundSize");
    command.emit("refreshSelection");

    command.run();

    editor.nextTick(() => {
      editor.emit("refreshSelectionTool");
    });
  },
};

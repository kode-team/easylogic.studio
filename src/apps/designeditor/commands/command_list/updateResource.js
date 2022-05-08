export default {
  command: "updateResource",
  execute: function (editor, items) {
    items.forEach((item) => {
      switch (item.type) {
        case "image/svg+xml":
        case "image/png":
        case "image/gif":
        case "image/jpg":
        case "image/jpeg":
          editor.context.commands.emit("updateImage", item);
          break;
        case "text/plain":
        case "text/html":
          editor.context.commands.emit("addText", {
            content: item.data,
          });
          // this.trigger('update.string', item);
          break;
        case "text/uri-list":
          editor.context.commands.emit("updateUriList", item);
          break;
      }
    });
  },
};

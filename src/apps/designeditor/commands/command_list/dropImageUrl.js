import loadOriginalImage from "elf/editor/util/loadOriginalImage";

export default {
  command: "dropImageUrl",
  execute: function (editor, imageUrl) {
    // convert data or blob to local url
    loadOriginalImage({ local: imageUrl }, (info) => {
      editor.context.commands.emit("addImage", { src: info.local, ...info });
    });
  },
};

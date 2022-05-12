import urlParser from "js-video-url-parser";

export default {
  command: "convertPasteText",
  execute: async (editor, text) => {
    const embedUrl = urlParser.create({
      videoInfo: urlParser.parse(text),
      format: "embed",
      mediaType: "clip",
    });

    if (embedUrl) {
      const center = editor.context.viewport.center;
      const width = 300;
      const height = 200;

      editor.context.commands.emit("newComponent", "iframe", {
        x: center[0] - width / 2,
        y: center[1] - height / 2,
        width: width,
        height: height,
        backgroundColor: "transparent",
        url: embedUrl,
      });
    }
  },
};

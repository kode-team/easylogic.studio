import ExportManager from "elf/editor/manager/manager-items/ExportManager";
import createImagePng from "elf/editor/util/createImagePng";
import loadOriginalImage from "elf/editor/util/loadOriginalImage";

export default {
  command: "savePNG",
  execute: function (editor, callbackCommand = "") {
    const item = editor.context.selection.current;

    if (item) {
      const svgString = ExportManager.generateSVG(editor, item).trim();
      const datauri = "data:image/svg+xml;base64," + window.btoa(svgString);
      loadOriginalImage({ local: datauri }, (info, img) => {
        createImagePng(img, (pngDataUri) => {
          if (callbackCommand) {
            editor.emit(callbackCommand, pngDataUri);
          }
        });
      });
    }
  },
};

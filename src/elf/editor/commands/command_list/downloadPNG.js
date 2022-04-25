import ExportManager from "elf/editor/manager/manager-items/ExportManager";
import createImagePng from "elf/editor/util/createImagePng";
import downloadFile from "elf/editor/util/downloadFile";
import loadOriginalImage from "elf/editor/util/loadOriginalImage";

export default {
  command: "downloadPNG",
  execute: function (editor, callbackCommand = "") {
    const item = editor.selection.current;

    if (item) {
      const svgString = ExportManager.generateSVG(editor, item).trim();
      const datauri = "data:image/svg+xml;base64," + window.btoa(svgString);
      const filename = item.id;
      loadOriginalImage({ local: datauri }, (info, img) => {
        createImagePng(img, (pngDataUri) => {
          downloadFile(pngDataUri, filename);

          if (callbackCommand) {
            editor.emit(callbackCommand, pngDataUri);
          }
        });
      });
    }
  },
};

import ExportManager from "elf/editor/manager/manager-items/ExportManager";
import downloadFile from "elf/editor/util/downloadFile";

export default {
  command: "downloadSVG",
  execute: function (editor) {
    const item = editor.selection.current;

    if (item) {
      var svgString = ExportManager.generateSVG(editor, item).trim();
      var datauri = "data:image/svg+xml;base64," + window.btoa(svgString);
      var filename = item.id;

      downloadFile(datauri, filename);
    }
  },
};

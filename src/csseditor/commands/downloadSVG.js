import ExportManager from "../../editor/ExportManager";
import downloadFile from "../../editor/util/downloadFile";

export default {
    command: 'downloadSVG',
    execute: function (editor) {
        var item = editor.selection.current || editor.$selection.currentArtboard;

        var svgString = ExportManager.generateSVG(editor, item).trim();
        var datauri = 'data:image/svg+xml;base64,' + window.btoa(svgString);
        var filename = item.id;

        downloadFile(datauri, filename)
    }

}
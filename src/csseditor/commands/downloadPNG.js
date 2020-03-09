import ExportManager from "../../editor/ExportManager";
import loadOriginalImage from "../../editor/util/loadOriginalImage";
import createImagePng from "../../editor/util/createImagePng";
import downloadFile from "../../editor/util/downloadFile";

export default {
    command: 'downloadPNG',
    execute: function (editor) {
        var item = editor.selection.current || editor.selection.currentArtboard;

        var svgString = ExportManager.generateSVG(item).trim();
        var datauri = 'data:image/svg+xml;base64,' + window.btoa(svgString);
        var filename = item.id;

        loadOriginalImage({local: datauri}, (info, img) => {
            createImagePng(img, (pngDataUri) => {
                downloadFile(pngDataUri, filename)
            })
        })
    }

}
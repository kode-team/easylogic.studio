
import loadOriginalImage from "@util/loadOriginalImage";
import createImagePng from "@util/createImagePng";
import downloadFile from "@util/downloadFile";
import ExportManager from "@manager/ExportManager";

export default {
    command: 'downloadPNG',
    execute: function (editor) {
        const item = editor.selection.current;

        if (item) {
            const svgString = ExportManager.generateSVG(editor, item).trim();
            const datauri = 'data:image/svg+xml;base64,' + window.btoa(svgString);
            const filename = item.id;
            loadOriginalImage({local: datauri}, (info, img) => {
                createImagePng(img, (pngDataUri) => {
                    downloadFile(pngDataUri, filename)
                })
            })
        }

    }

}
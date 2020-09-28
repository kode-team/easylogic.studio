
import loadOriginalImage from "@util/loadOriginalImage";
import createImagePng from "@util/createImagePng";
import downloadFile from "@util/downloadFile";
import ExportManager from "@manager/ExportManager";

export default {
    command: 'downloadPNG',
    execute: function (editor) {
        console.log('aaaa');
        var item = editor.selection.current || editor.selection.currentArtboard;

        var svgString = ExportManager.generateSVG(editor, item).trim();
        var datauri = 'data:image/svg+xml;base64,' + window.btoa(svgString);
        var filename = item.id;
        console.log('aaaa', datauri);
        loadOriginalImage({local: datauri}, (info, img) => {
            console.log(datauri);
            createImagePng(img, (pngDataUri) => {
                downloadFile(pngDataUri, filename)
            })
        })
    }

}
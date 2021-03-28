
import loadOriginalImage from "el/editor/util/loadOriginalImage";
import createImagePng from "el/editor/util/createImagePng";
import downloadFile from "el/editor/util/downloadFile";
import ExportManager from "el/editor/manager/ExportManager";

export default {
    command: 'downloadPNG',
    execute: function (editor, callbackCommand = '') {
        const item = editor.selection.current;

        if (item) {
            const svgString = ExportManager.generateSVG(editor, item).trim();
            const datauri = 'data:image/svg+xml;base64,' + window.btoa(svgString);
            const filename = item.id;
            loadOriginalImage({local: datauri}, (info, img) => {
                createImagePng(img, (pngDataUri) => {
                    downloadFile(pngDataUri, filename)

                    if (callbackCommand) {
                        editor.emit(callbackCommand, pngDataUri);
                    }
                })
            })
        }

    }

}

import loadOriginalImage from "@util/loadOriginalImage";
import createImagePng from "@util/createImagePng";
import ExportManager from "@manager/ExportManager";

export default {
    command: 'savePNG',
    execute: function (editor, callbackCommand = '') {
        const item = editor.selection.current;

        if (item) {
            const svgString = ExportManager.generateSVG(editor, item).trim();
            const datauri = 'data:image/svg+xml;base64,' + window.btoa(svgString);
            loadOriginalImage({local: datauri}, (info, img) => {
                createImagePng(img, (pngDataUri) => {
                    if (callbackCommand) {
                        editor.emit(callbackCommand, pngDataUri);
                    }
                })
            })
        }

    }

}
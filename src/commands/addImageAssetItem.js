import { EDIT_MODE_SELECTION } from "@manager/Editor";
import loadOriginalImage from "@util/loadOriginalImage";

export default {
    command: 'addImageAssetItem',
    execute: function (editor, imageObject, rect = {}) {
        var project = editor.selection.currentProject;

        if (project) {

            // append image asset 
            project.createImage(imageObject);
            editor.emit('addImageAsset');

            // convert data or blob to local url 
            loadOriginalImage(imageObject, (info) => {
                editor.emit('addImage', {src: imageObject.id, ...info, ...rect });
                editor.changeMode(EDIT_MODE_SELECTION);
                editor.emit('afterChangeMode');                
            });

        }
    }
}
import { EDIT_MODE_SELECTION } from "../../editor/Editor";
import loadOriginalImage from "../../editor/util/loadOriginalImage";

export default {
    command: 'addImageAssetItem',
    execute: function (editor, obj, rect = {}) {
        var project = editor.selection.currentProject;

        if (project) {

            // append image asset 
            project.createImage(obj);
            editor.emit('addImageAsset');

            // convert data or blob to local url 
            loadOriginalImage(obj, (info) => {
                editor.emit('addImage', {src: obj.local, ...info, ...rect });
                editor.changeMode(EDIT_MODE_SELECTION);
                editor.emit('afterChangeMode');                
            });

        }
    }
}
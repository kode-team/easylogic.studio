import { EDIT_MODE_SELECTION } from "../../editor/Editor";
import loadOriginalVideo from "../../editor/util/loadOriginalVideo";

export default {
    command: 'addVideoAssetItem',
    execute: function (editor, obj, rect = {}) {
        var project = editor.selection.currentProject;

        if (project) {

            // append image asset 
            project.createVideo(obj);
            editor.emit('addVideoAsset');

            // convert data or blob to local url 
            loadOriginalVideo(obj, (info) => {
                editor.emit('addVideo', {src: obj.local, ...info, ...rect });
                editor.changeMode(EDIT_MODE_SELECTION);
                editor.emit('afterChangeMode');                
            });

        }
    }
}
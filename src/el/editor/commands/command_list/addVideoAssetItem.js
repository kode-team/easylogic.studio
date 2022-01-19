import { EDIT_MODE_SELECTION } from "el/editor/manager/Editor";
import loadOriginalVideo from "el/editor/util/loadOriginalVideo";

export default {
    command: 'addVideoAssetItem',
    execute: function (editor, videoObject, rect = {}, containerItem = undefined) {
        var project = editor.selection.currentProject;

        if (project) {

            // append image asset 
            project.createVideo(videoObject);
            editor.emit('addVideoAsset');

            // convert data or blob to local url 
            loadOriginalVideo(videoObject, (info) => {
                editor.emit('addVideo', {src: videoObject.id, ...info, ...rect }, containerItem);
                editor.changeMode(EDIT_MODE_SELECTION);
                                
            });

        }
    }
}
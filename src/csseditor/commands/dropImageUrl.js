import { EDIT_MODE_SELECTION } from "../../editor/Editor";
import loadOriginalImage from "../../editor/util/loadOriginalImage";

export default {
    command: 'dropImageUrl',
    execute: function (editor, imageUrl) {
        // convert data or blob to local url 
        loadOriginalImage({local: imageUrl}, (info) => {

            editor.emit('addImage', {src: info.local, ...info });
            editor.changeMode(EDIT_MODE_SELECTION);
            editor.emit('afterChangeMode');                
        });
    }

} 
import { EDIT_MODE_SELECTION } from "el/editor/manager/Editor";
import { Length } from "el/editor/unit/Length";
import loadOriginalImage from "el/editor/util/loadOriginalImage";

export default {
    command: 'addImageAssetItem',
    execute: function (editor, imageObject, rect = {}, containerItem = undefined) {
        var project = editor.selection.currentProject;

        if (project) {

            // append image asset 
            project.createImage(imageObject);
            editor.emit('addImageAsset');

            // convert data or blob to local url 
            loadOriginalImage(imageObject, (info) => {

                // width 랑 같은 비율로 맞추기 
                const rate = rect.width.value/info.width.value;
                const width = rect.width;
                const height = Length.px(info.height.value * rate); 

                editor.emit('addImage', {
                    src: imageObject.id, 
                    ...info, 
                    ...rect, 
                    width, 
                    height 
                }, containerItem);
                editor.changeMode(EDIT_MODE_SELECTION);
                                
            });

        }
    }
}
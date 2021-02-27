import { uuidShort } from "@core/functions/math";

export default {
    command: 'updateImage',
    execute: function (editor, imageFileOrBlob, rect, containerItem) {
        var reader = new FileReader();
        reader.onload = (e) => {
            var datauri = e.target.result;
            var local = URL.createObjectURL(imageFileOrBlob);


            editor.emit('addImageAssetItem', {
                id: uuidShort(),
                type: imageFileOrBlob.type,
                name: imageFileOrBlob.name, 
                original: datauri, 
                local
            }, rect, containerItem)
        }

        reader.readAsDataURL(imageFileOrBlob);
    }
}
import { uuidShort } from "../../util/functions/math";

export default {
    command: 'updateImage',
    execute: function (editor, item, rect) {
        var reader = new FileReader();
        reader.onload = (e) => {
            var datauri = e.target.result;
            var local = URL.createObjectURL(item);

            editor.emit('addImageAssetItem', {
                id: uuidShort(),
                type: item.type,
                name: item.name, 
                original: datauri, 
                local
            }, rect)
        }

        reader.readAsDataURL(item);
    }
}
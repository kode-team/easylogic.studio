import { BackgroundImage } from "../../editor/css-property/BackgroundImage";
import { STRING_TO_CSS, CSS_TO_STRING } from "../../util/functions/func";
import { URLImageResource } from "../../editor/image-resource/URLImageResource";

export default {
    command: 'addBackgroundImageAsset',
    execute: function (editor, url, id = null) {
        var items = editor.selection.itemsByIds(id);

        items.forEach(item => {
            let images = BackgroundImage.parseStyle(STRING_TO_CSS(item['background-image']));

            images.unshift(new BackgroundImage({
                image: new URLImageResource({ url })
            }))

            const value = CSS_TO_STRING(BackgroundImage.toPropertyCSS(images)) 

            editor.emit('setAttribute', { 'background-image': value }, item.id)
        })
    }
}
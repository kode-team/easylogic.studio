import { BackgroundImage } from "../../editor/css-property/BackgroundImage";
import { STRING_TO_CSS, CSS_TO_STRING } from "../../util/functions/func";
import { LinearGradient } from "../../editor/image-resource/LinearGradient";

export default {
    command: 'addBackgroundImageGradient',
    execute: function (editor, gradient, id = null) {
        var items = editor.selection.itemsByIds(id);
        items.forEach(item => {
            let images = BackgroundImage.parseStyle(STRING_TO_CSS(item['background-image']));

            images.unshift(new BackgroundImage({
                image: LinearGradient.parse(gradient)
            }))

            const value = CSS_TO_STRING(BackgroundImage.toPropertyCSS(images)) 

            editor.emit('setAttribute', { 'background-image': value }, item.id)
        })
    }
}
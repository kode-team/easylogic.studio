import { BackgroundImage } from "../../editor/css-property/BackgroundImage";
import { STRING_TO_CSS } from "../../util/functions/func";
import _refreshSelection from "./_refreshSelection";

export default {
    command: 'addBackgroundImageGradient',
    execute: function (editor, gradient, id = null) {
        var items = editor.selection.itemsByIds(id);
        items.forEach(item => {
            let images = BackgroundImage.parseStyle(STRING_TO_CSS(item['background-image']));

            images.unshift(new BackgroundImage({
                image: BackgroundImage.parseImage(gradient)
            }))

            editor.emit('setAttribute', { 'background-image': BackgroundImage.join(images) }, item.id)
        })

        _refreshSelection(editor, true);
    }
}
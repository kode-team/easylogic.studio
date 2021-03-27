import { BackgroundImage } from "@property-parser/BackgroundImage";
import { STRING_TO_CSS } from "@sapa/functions/func";
import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command: 'addBackgroundImageGradient',
    execute: function (editor, gradient, id = null) {
        var items = editor.selection.itemsByIds(id);
        let itemsMap = {} 
        items.forEach(item => {
            let images = BackgroundImage.parseStyle(STRING_TO_CSS(item['background-image']));

            images.unshift(new BackgroundImage({
                image: BackgroundImage.parseImage(gradient)
            }))

            itemsMap[item.id] = {
                'background-image': BackgroundImage.join(images)
            }
        })

        editor.emit('history.setAttributeForMulti', 'add gradient', itemsMap);              
    }
}
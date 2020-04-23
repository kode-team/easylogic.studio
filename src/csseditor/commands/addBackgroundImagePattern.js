import { BackgroundImage } from "../../editor/css-property/BackgroundImage";
import { STRING_TO_CSS, CSS_TO_STRING } from "../../util/functions/func";
import _refreshSelection from "./_refreshSelection";

export default {
    command: 'addBackgroundImagePattern',
    execute: function (editor, {pattern, color, backgroundColor}, id = null) {

        let attrs = {}

        if (color) attrs.color = color; 
        if (backgroundColor) attrs['background-color'] = backgroundColor; 

        var items = editor.selection.itemsByIds(id);
        items.forEach(item => {


            let images = BackgroundImage.parseStyle(STRING_TO_CSS(item['background-image']));
            let targetImages = BackgroundImage.parseStyle(STRING_TO_CSS(pattern));

            const value = CSS_TO_STRING(BackgroundImage.toPropertyCSS([...targetImages, ...images])) 

            attrs['background-image'] = value; 
            editor.emit('setAttribute', attrs, item.id)
            
        })

        _refreshSelection(editor, true);
    }
}
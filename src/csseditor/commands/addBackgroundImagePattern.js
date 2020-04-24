import { BackgroundImage } from "../../editor/css-property/BackgroundImage";
import { STRING_TO_CSS, CSS_TO_STRING } from "../../util/functions/func";
import _refreshSelection from "./_refreshSelection";
import { Pattern } from "../../editor/css-property/Pattern";

export default {
    command: 'addBackgroundImagePattern',
    execute: function (editor, pattern, id = null) {

        var items = editor.selection.itemsByIds(id);
        items.forEach(item => {
            editor.emit('setAttribute', {
                pattern: Pattern.join([...Pattern.parseStyle(pattern), ...Pattern.parseStyle(item.pattern)])
            }, item.id)
            
        })

        _refreshSelection(editor, true);
    }
}
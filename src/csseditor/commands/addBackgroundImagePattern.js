import { Pattern } from "../../editor/css-property/Pattern";

export default {
    command: 'addBackgroundImagePattern',
    execute: function (editor, pattern, id = null) {

        var items = editor.selection.itemsByIds(id);
        let itemsMap = {} 
        items.forEach(item => {

            itemsMap[item.id] = {
                pattern: Pattern.join([
                    ...Pattern.parseStyle(pattern), 
                    ...Pattern.parseStyle(item.pattern)
                ])
            }
        })

        editor.emit('history.setAttributeForMulti', 'add pattern', itemsMap);     

    }
}
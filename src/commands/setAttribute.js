import { isFunction } from "@core/functions/func";

export default {
    command : 'setAttribute',
    execute: function (editor, attrs = {}, ids = null) {
        editor.selection.itemsByIds(ids).forEach(item => {
    
            Object.keys(attrs).forEach(key => {
                let value = attrs[key];
    
                if (isFunction(value)) {
                    value = value(item);
                }
                item.reset({ [key] : value });
            })
    
            editor.emit('refreshElement', item);
        });
    }
}
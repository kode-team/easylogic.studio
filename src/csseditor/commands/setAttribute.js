import { isFunction } from "../../util/functions/func";

export default {
    command : 'setAttribute',
    execute: function (editor, attrs = {}, ids = null, isChangeFragment = false, isBoundSize = false) {

        editor.selection.itemsByIds(ids).forEach(item => {
    
            Object.keys(attrs).forEach(key => {
                let value = attrs[key];
    
                if (isFunction(value)) {
                    value = value(item);
                }
                item.reset({ [key] : value });
            })
    
            editor.emit('refreshElement', item, isChangeFragment, isBoundSize);
        });
    }
}
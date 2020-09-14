import { isFunction } from "@core/functions/func";

export default {
    command : 'setAttributeForMulti',
    execute: function (editor, multiAttrs = {}, isChangeFragment = false, isBoundSize = false) {

        Object.keys(multiAttrs).forEach(id => {
            const attrs = multiAttrs[id];

            editor.selection.itemsByIds(id).forEach(item => {
    
                Object.keys(attrs).forEach(key => {
                    let value = attrs[key];
        
                    if (isFunction(value)) {
                        value = value(item);
                    }
                    item.reset({ [key] : value });
                })
        
                editor.emit('refreshElement', item, isChangeFragment, isBoundSize);
            });
        })


    }
}
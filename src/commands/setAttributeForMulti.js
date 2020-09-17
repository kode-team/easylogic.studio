import { isFunction } from "@core/functions/func";
import { Editor } from "@manager/Editor";

export default {
    command : 'setAttributeForMulti',
    /**
     * 
     * @param {Editor} editor 
     * @param {object} multiAttrs  아이디 기반의 속성 리스트  { [id] : { key: value }, .... }
     */
    execute: function (editor, multiAttrs = {}) {

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
        
                editor.emit('refreshElement', item);
            });
        })


    }
}
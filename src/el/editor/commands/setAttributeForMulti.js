import { isFunction } from "el/base/functions/func";
import { Editor } from "el/editor/manager/Editor";

export default {
    command: 'setAttributeForMulti',
    /**
     * 
     * @param {Editor} editor 
     * @param {object} multiAttrs  아이디 기반의 속성 리스트  { [id] : { key: value }, .... }
     */
    execute: function (editor, multiAttrs = {}) {

        Object.keys(multiAttrs).forEach(id => {
            const attrs = multiAttrs[id];

            editor.selection.itemsByIds(id).forEach(item => {

                const newAttrs = {};

                Object.keys(attrs).forEach(key => {
                    let value = attrs[key];

                    newAttrs[key] = isFunction(value) ? value(item) : value;                    
                })


                const isChanged = item.reset(newAttrs);

                if (isChanged) {
                    editor.emit('refreshElement', item);
                    editor.emit('changeValue', id, newAttrs);
                }

            });
        })


    }
}
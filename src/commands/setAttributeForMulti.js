import { isFunction } from "@sapa/functions/func";
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

                // path 나 내부 요소가 크기가 정해져 있어야 하는 것들을 위해서 
                // 기본 모양에 대한 캐쉬를 적용한다. 
                item.setCache();                
        
                editor.emit('refreshElement', item);
            });
        })


    }
}
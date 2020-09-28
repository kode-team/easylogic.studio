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

            // path 나 내부 요소가 크기가 정해져 있어야 하는 것들을 위해서 
            // 기본 모양에 대한 캐쉬를 적용한다. 
            item.setCache();                
    
            editor.emit('refreshElement', item);
        });
    }
}
import Sort from "../../editor/Sort";

export default {
    command : 'same.width',
    execute: function (editor) {

        var len = editor.selection.items.length ;

        if (len == 1) {
            // artboard 랑 크기를 맞출지 고민해보자. 
        } else if (len > 1) {
            const rect = editor.selection.allRect;
            editor.selection.each(item => {
                item.setScreenX(rect.x.value);
                item.width.set(rect.width.value);
            })

        }
        
        editor.emit('resetSelection');
    }
}
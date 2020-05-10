import Sort from "../../editor/Sort";

export default {
    command : 'same.width',
    execute: function (editor) {

        var len = editor.selection.items.length ;

        if (len == 1) {
            // artboard 랑 크기를 맞출지 고민해보자. 
        } else if (len > 1) {
            editor.selection.each(item => {
                item.setScreenX(editor.selection.allRect.x.value);
                item.width.set( editor.selection.allRect.width.value);
            })

        }
        
        editor.emit('resetSelection');
    }
}
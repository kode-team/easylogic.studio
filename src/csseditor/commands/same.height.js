import Sort from "../../editor/Sort";

export default {
    command : 'same.width',
    execute: function (editor) {

        var len = editor.selection.items.length ;

        if (len == 1) {
            // artboard 랑 크기를 맞출지 고민해보자. 
        } else if (len > 1) {
            editor.selection.each(item => {
                item.setScreenY(editor.selection.allRect.y.value);
                item.height.set( editor.selection.allRect.height.value);
            })
        }
        
        editor.emit('resetSelection');
    }
}
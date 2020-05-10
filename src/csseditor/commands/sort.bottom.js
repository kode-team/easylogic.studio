import Sort from "../../editor/Sort";

export default {
    command : 'sort.bottom',
    execute: function (editor) {
        var container = Sort.getContainer(editor)        
        var y2 = container.screenY2.value;         

        editor.selection.each(item => {
            item.setScreenY2(y2);
        })

        editor.emit('resetSelection');
    }
}
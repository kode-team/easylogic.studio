import Sort from "../../editor/Sort";

export default {
    command : 'sort.right',
    execute: function (editor) {
        var container = Sort.getContainer(editor)        
        var x2 = container.screenX2.value;         

        editor.selection.each(item => {
            item.setScreenX2(x2);
        })

        editor.emit('resetSelection');
    }
}
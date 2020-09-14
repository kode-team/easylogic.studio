import Sort from "@manager/Sort";

export default {
    command : 'sort.center',
    execute: function (editor) {
        var container = Sort.getContainer(editor)        
        var x = container.screenX.value + container.width.value / 2; 

        editor.selection.each(item => {
            item.setScreenXCenter(x);
        })

        editor.emit('resetSelection');
    }
}
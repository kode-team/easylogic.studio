import Sort from "@manager/Sort";

export default {
    command : 'sort.middle',
    execute: function (editor) {
        var container = Sort.getContainer(editor)        
        var y = container.screenY.value + container.height.value / 2;         

        editor.selection.each(item => {
            item.setScreenYMiddle(y);
        })

        editor.emit('resetSelection');
    }
}
import Sort from "@manager/Sort";

export default {
    command : 'sort.top',
    execute: function (editor) {
        var y =  Sort.getContainer(editor).screenY.value

        editor.selection.each(item => {
            item.setScreenY(y);
        })

        editor.emit('resetSelection');
    }
}
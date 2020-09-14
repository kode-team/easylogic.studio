import Sort from "@manager/Sort";

export default {
    command : 'sort.left',
    execute: function (editor) {
        var x =  Sort.getContainer(editor).screenX.value

        editor.selection.each(item => {
            item.setScreenX(x);
        })

        editor.emit('resetSelection');
    }
}
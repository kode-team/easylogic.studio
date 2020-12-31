export default {
    command : 'same.width',
    execute: function (editor) {

        if (editor.selection.isMany) {
            const rect = editor.selection.allRect;
            editor.selection.each(item => {
                item.setScreenX(rect.x.value);
                item.width.set(rect.width.value);
            })

        }
    }
}
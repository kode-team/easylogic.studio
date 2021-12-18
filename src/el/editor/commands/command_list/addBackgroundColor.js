export default {
    command: 'addBackgroundColor',
    execute: function (editor, color, id = null) {
        editor.command('setAttributeForMulti', 'add background color', editor.selection.packByValue({
            'background-color': color
        }, id));
    }
}
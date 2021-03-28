export default {
    command: 'addBackgroundColor',
    execute: function (editor, color, id = null) {
        var items = editor.selection.itemsByIds(id);
        let itemsMap = {} 
        items.forEach(item => {
            itemsMap[item.id] = {'background-color': color}
        })

        editor.emit('history.setAttributeForMulti', 'add background color', itemsMap);
    }
}
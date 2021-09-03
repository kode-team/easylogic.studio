export default {
    command: 'update',
    execute: function (editor, id = null, attrs = {}) {

        editor.emit('beforeUpdate', id, attrs);

        const item = editor.modelManager.get(id);

        if (item) {
            const isChanged = item.reset(attrs);

            if (isChanged) {
                editor.emit('refreshElement', item);
            }
        }

        editor.emit('afterUpdate', id, attrs);        
    }
}
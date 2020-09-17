export default {
    command : 'history.setAttribute',
    execute: function (editor, message, attrs = {}, ids = null) {

        editor.emit('setAttribute', attrs, ids)

        editor.history.add(message, this, {
            currentValues: [attrs, ids],
            undoValues: editor.history.getUndoValues(attrs)
        })

        editor.nextTick(() =>  {
          editor.history.saveSelection()  
        })        
    },

    redo: function (editor, {currentValues}) {
        editor.emit('setAttribute', ...currentValues)
        editor.nextTick(() => {
            editor.emit('refreshAll');
        })

    },

    undo: function (editor, { undoValues }) {
        const ids = Object.keys(undoValues)
        const items = editor.selection.itemsByIds(ids)

        items.forEach(item => {
            item.reset(undoValues[item.id]);
        })
        editor.nextTick(() => {
            editor.emit('refreshAll');
        })
    }
}
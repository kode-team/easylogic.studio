export default {
    command : 'history.setAttribute',
    execute: function (editor, message, attrs = {}, ids = null, isChangeFragment = false, isBoundSize = false) {

        editor.emit('setAttribute', attrs, ids, isChangeFragment, isBoundSize)

        editor.history.add(message, this, {
            currentValues: [attrs, ids, isChangeFragment, isBoundSize],
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
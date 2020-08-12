export default {
    command : 'history.setAttributeForMulti',
    execute: function (editor, multiAttrs = {}, isChangeFragment = false, isBoundSize = false) {

        editor.emit('setAttributeForMulti', multiAttrs, isChangeFragment, isBoundSize)

        editor.history.add('set attribute for multi', this, {
            currentValues: [multiAttrs, isChangeFragment, isBoundSize],
            undoValues: editor.history.getUndoValuesForMulti(multiAttrs)
        })

        editor.nextTick(() =>  {
          editor.history.saveSelection()  
        })        
    },

    redo: function (editor, {currentValues}) {
        editor.emit('setAttributeForMulti', ...currentValues)
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
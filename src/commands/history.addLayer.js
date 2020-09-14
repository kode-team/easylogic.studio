import _doForceRefreshSelection from "./_doForceRefreshSelection";

export default {
    command: 'history.addLayer',
    description: 'add layer in history ',
    execute: function (editor, message, layer, rect = {}, isSelected = true) {

        editor.emit('addLayer', layer, rect, isSelected)

        editor.nextTick(() => {
            editor.history.add(message, this, {
                // 이미 변환이 된 객체(즉, screenX, screenY 가  적용된 객체라 rect 로 영역을 다시 지정하지 않는다. )
                currentValues: [layer, {}, isSelected, layer.parent],
                undoValues: [layer.id]
            })
        })

        editor.nextTick(() =>  {
          editor.history.saveSelection()  
        })        
    },

    redo: function (editor, {currentValues}) {
        editor.emit('addLayer', ...currentValues)
        editor.nextTick(() => {
            editor.emit('refreshAll');
        })

    },

    undo: function (editor, { undoValues }) {
        const ids = undoValues
        const items = editor.selection.itemsByIds(ids)

        // 추가는 하나 밖에 안 했을테니 이게 맞을지도
        // 여러개일수도 있으니 이걸로 동시에 여러개를 삭제 하자 
        items.forEach(item => {
            if (item) {
                item.remove();
            }
        })

        editor.nextTick(() => {
            editor.emit('refreshAll');
        })
    }
}
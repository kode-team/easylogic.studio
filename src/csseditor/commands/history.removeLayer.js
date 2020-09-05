export default {
    command : 'history.removeLayer',
    description: 'remove layer',
    execute: function (editor, message, ids = []) {


        // // 지우기 전 객체를 모두 clone 한다. 
        // // var items = editor.selection.itemsByIds(ids || editor.selection.ids)

        // // 클론 
        // // var cloneList = editor.clone(items)        

        // // 전체 삭제 
        // // items.forEach(item => item.remove())

        // // editor.selection.empty();


        // // undo, redo 저장 
        // // undo 는 클론한 데이타 다시 복구 
        // // redo는 ids 를 다시 지우기 

        // editor.selection.itemsByIds(editor.selection.ids).forEach(item => {
        //     item.remove();
        // })

        // editor.selection.empty();

        // editor.emit('removeLayer', ids, (stack => {
        //     editor.history.add(message, this, {
        //         currentValues: [ids],
        //         undoValues: editor.history.getUndoValues(attrs)
        //     })
    
        // }))


        // editor.nextTick(() =>  {
        //   editor.history.saveSelection()  
        // })        


        // editor.selection.itemsByIds(editor.selection.ids).forEach(item => {
        //     item.remove();
        // })

        // editor.selection.empty();

        // editor.emit('refreshArtboard')
    }
}
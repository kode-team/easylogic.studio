export default function _doForceRefreshSelection (editor) {
    editor.emit('noneSelectMenu')

    editor.emit('refreshAll')    

    editor.nextTick(() => {
        editor.emit('refreshSelectionTool');       
    })    

}
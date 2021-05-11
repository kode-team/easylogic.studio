export default function _doForceRefreshSelection (editor) {
    editor.emit('noneSelectMenu')
    editor.nextTick(() => {
        editor.emit('refreshAll')    
        editor.emit('refreshSelectionTool');       
    })    

}
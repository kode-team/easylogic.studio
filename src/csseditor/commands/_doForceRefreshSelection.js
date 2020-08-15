export default function _doForceRefreshSelection (editor, isSelectedItems = false, delay = 0) {

    // editor.emit('hideSubEditor');
    editor.emit('noneSelectMenu')

    editor.emit('refreshAll')    

    editor.nextTick(() => {
        editor.emit('refreshSelectionTool');       
    })    

}
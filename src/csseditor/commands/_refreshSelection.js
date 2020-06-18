export default function _refreshSelection (editor, isSelectedItems = false, delay = 0) {

    // editor.emit('hideSubEditor');
    editor.emit('noneSelectMenu')

    editor.emit('refreshAll')

    setTimeout(() => {
        editor.emit('refreshAllElementBoundSize');
    }, delay)

    setTimeout(() => {
        editor.emit('refreshSelection');
        editor.emit('refreshSelectionTool');        
    }, delay + delay)    

}
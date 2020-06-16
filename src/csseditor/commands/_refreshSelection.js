export default function _refreshSelection (editor, isSelectedItems = false, delay = 0) {

    // editor.emit('hideSubEditor');
    editor.emit('noneSelectMenu')
    if (isSelectedItems) {
        editor.emit('refreshSelectionStyleView')
    } else {
        editor.emit('refreshAll')
    }

    setTimeout(() => {
        editor.emit('refreshAllElementBoundSize');
        editor.emit('refreshSelection');
        editor.emit('refreshSelectionTool');        
    }, delay)

}
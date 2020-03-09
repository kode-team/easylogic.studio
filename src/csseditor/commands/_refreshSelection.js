export default function _refreshSelection (editor, isSelectedItems = false) {

    editor.emit('hideSubEditor');
    editor.emit('noneSelectMenu')
    if (isSelectedItems) {
        editor.emit('refreshSelectionStyleView')
    } else {
        editor.emit('refreshAll')
    }
    editor.emit('refreshAllElementBoundSize');
    editor.emit('refreshSelection');
    editor.emit('refreshSelectionTool');        
}
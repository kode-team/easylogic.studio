export default function _refreshSelection (editor) {
    editor.emit('hideSubEditor');
    editor.emit('noneSelectMenu')
    editor.emit('refreshAll')        
    editor.emit('refreshAllElementBoundSize');
    editor.emit('refreshSelection');
    editor.emit('refreshSelectionTool');        
}
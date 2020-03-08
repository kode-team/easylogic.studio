export default function addPolygon (editor, mode = 'draw') {
    editor.emit('hideSubEditor');    
    editor.selection.empty();
    editor.emit('initSelectionTool');
    editor.emit('showPolygonEditor', mode );
}
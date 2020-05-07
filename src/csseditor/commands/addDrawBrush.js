export default function addDrawBrush (editor) {
    // editor.emit('hideSubEditor');
    editor.selection.empty();
    editor.emit('refreshSelectionTool');        
    editor.emit('showBrushDrawEditor');
}
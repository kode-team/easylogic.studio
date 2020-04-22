export default function addDrawBrush (editor) {
    // editor.emit('hideSubEditor');
    editor.selection.empty();
    editor.emit('initSelectionTool');        
    editor.emit('showBrushDrawEditor');
}
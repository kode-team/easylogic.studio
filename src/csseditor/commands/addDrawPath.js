export default function addDrawPath (editor) {
    // editor.emit('hideSubEditor');
    editor.selection.empty();
    editor.emit('refreshSelectionTool');        
    editor.emit('showPathDrawEditor');
}
export default function addPath (editor) {
    // editor.emit('hideSubEditor');
    editor.selection.empty();
    editor.emit('refreshSelectionTool');        
    editor.emit('showPathEditor', 'path' );
}
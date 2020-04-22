export default function addPath (editor) {
    // editor.emit('hideSubEditor');
    editor.selection.empty();
    editor.emit('initSelectionTool');        
    editor.emit('showPathEditor', 'path' );
}
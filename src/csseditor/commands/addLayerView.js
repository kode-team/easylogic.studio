export default function addLayerView (editor, type) {
    // editor.emit('hideSubEditor');
    editor.selection.empty();
    editor.emit('refreshSelectionTool');        
    editor.emit('showLayerAppendView', type );
}
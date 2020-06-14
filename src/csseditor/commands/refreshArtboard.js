/**
 * refresh element command 
 * 
 * @param {Editor} editor - editor instance 
 * @param {Array} args - command parameters 
 */
export default function refreshArtboard (editor) {
    editor.emit('refreshLayerTreeView')    
    editor.emit('refreshAllCanvas', true);
    editor.emit('refreshStyleView');
    editor.emit('refreshAllElementBoundSize')   
    editor.emit('refreshSelection');
}
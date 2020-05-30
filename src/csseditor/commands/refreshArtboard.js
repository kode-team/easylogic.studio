/**
 * refresh element command 
 * 
 * @param {Editor} editor - editor instance 
 * @param {Array} args - command parameters 
 */
export default function refreshArtboard (editor, ...args) {
    editor.emit('refreshLayerTreeView')    
    editor.emit('refreshAllCanvas', ...args);
    editor.emit('refreshStyleView');
    editor.emit('refreshAllElementBoundSize')   
}
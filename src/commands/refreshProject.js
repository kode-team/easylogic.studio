/**
 * refresh element command 
 * 
 * @param {Editor} editor - editor instance 
 * @param {Array} args - command parameters 
 */
export default function refreshProject (editor, current) {
    editor.emit('refreshStyleView', current, true);
}
/**
 * refresh element command 
 * 
 * @param {Editor} editor - editor instance 
 * @param {Array} args - command parameters 
 */
export default function refreshElement (editor, current) {
    // 화면 사이즈 조정         
    editor.emit('refreshSelectionStyleView', current)

    // 화면 레이아웃 재정렬 
    editor.emit('refreshElementBoundSize', editor.selection.getRootItem(current))
}
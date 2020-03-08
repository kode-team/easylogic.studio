/**
 * refresh element command 
 * 
 * @param {Editor} editor - editor instance 
 * @param {Array} args - command parameters 
 */
export default function refreshElement (editor, current, isChangeFragment = false) {
    // 화면 사이즈 조정         
    editor.emit('refreshSelectionStyleView', current, isChangeFragment, current && current.enableHasChildren() === false)

    // 화면 레이아웃 재정렬 
    editor.emit('refreshElementBoundSize', editor.selection.getRootItem(current))
}
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
    // TODO: 화면 레이아웃은 규칙에 맞춰서 rendering 에 상관 없이 구현되어야 한다. 
    if (current && current.isNot('project') && (current.isLayoutItem() || current.parent.is('boolean-path'))) {
        editor.emit('refreshElementBoundSize', current.parent)
    } else {
        editor.emit('refreshElementBoundSize', current)
    }

    // editor.emit('refreshElementBoundSize', editor.selection.getRootItem(current))

}
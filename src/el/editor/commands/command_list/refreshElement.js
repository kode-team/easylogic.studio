/**
 * refresh element command 
 * 
 * @param {Editor} editor - editor instance 
 * @param {Array} args - command parameters 
 */
 export default {
    command : 'refreshElement',
    execute: function (editor, current) {
        // 화면 사이즈 조정         
        editor.emit('refreshSelectionStyleView', current)
    
        // 화면 레이아웃 재정렬 
        if (current && current.is('project')) {
            editor.emit('refreshElementBoundSize', current)
        } else if (current && (current.isLayoutItem() || current.parent.is('boolean-path'))) {
            editor.emit('refreshElementBoundSize', current.parent)
        } else {
            editor.emit('refreshElementBoundSize', current)
        }
    }
}
/**
 * 객체 추가 모드로 변경 
 * 
 * 대상객체 : rect, circle, text, image, video, svg-textpath 
 * 
 * @param {*} editor 
 * @param {*} type 
 */
export default function addLayerView (editor, type, data = {}) {
    // editor.emit('hideSubEditor');
    editor.selection.empty();
    editor.emit('refreshSelectionTool');        
    editor.emit('hideAddViewLayer')

    if (type === 'select') {
        // NOOP
        // select 는 아무것도 하지 않는다. 
    } else if (type === 'brush') {
        editor.emit('showPathDrawEditor');
    } else if (type === 'path') {
        editor.emit('showPathEditor', 'path' );
    } else  {
        editor.emit('showLayerAppendView', type, data );
    }

}
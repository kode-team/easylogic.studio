/**
 * 객체 추가 모드로 변경 
 * 
 * 대상객체 : rect, circle, text, image, video, svg-textpath 
 * 
 * @param {*} editor 
 * @param {*} type 
 */
export default function addLayerView (editor, type) {
    // editor.emit('hideSubEditor');
    editor.selection.empty();
    editor.emit('refreshSelectionTool');        
    editor.emit('showLayerAppendView', type );
}
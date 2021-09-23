/**
 * 객체 추가 모드로 변경 
 * 
 * @param {*} editor 
 * @param {*} type 
 */
export default async function addLayerView (editor, type, data = {}) {
    // editor.emit('hideSubEditor');
    editor.selection.empty();
    await editor.emit('refreshSelectionTool');        
    await editor.emit('hideAddViewLayer');
    await editor.emit('removeGuideLine');

    if (type === 'select') {
        // NOOP
        // select 는 아무것도 하지 않는다. 
    } else if (type === 'brush') {
        await editor.emit('showPathDrawEditor');
    } else if (type === 'path') {
        await editor.emit('showPathEditor', 'path' );
    } else  {
        await editor.emit('showLayerAppendView', type, data );
    }
}
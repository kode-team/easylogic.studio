/**
 * @deprecated
 */
export default function addComponentType (editor, type) {
    // editor.emit('hideSubEditor');
    editor.changeAddType(type)
    editor.emit('afterChangeMode');
    editor.emit('addStatusBarMessage', `Drag if you want to create ${type} layer`);    
}

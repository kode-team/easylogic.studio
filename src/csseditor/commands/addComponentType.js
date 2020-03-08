export default function addComponentType (editor, type) {
    editor.emit('hideSubEditor');
    editor.changeAddType(type)

    editor.emit('afterChangeMode');
}

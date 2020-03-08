export default function addImage (editor, rect = {}) {
    editor.emit('newComponent', 'image', rect, rect)
}  
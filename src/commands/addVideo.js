export default function addVideo (editor, rect = {}) {
    editor.emit('newComponent', 'video', rect, rect)
}  
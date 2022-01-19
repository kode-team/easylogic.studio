export default function addImage (editor, rect = {}, containerItem = undefined) {
    editor.emit('newComponent', 'image', rect, true, containerItem)
}  
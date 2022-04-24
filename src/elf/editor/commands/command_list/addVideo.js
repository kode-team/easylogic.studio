export default function addVideo(editor, rect = {}, containerItem = undefined) {
  editor.emit("newComponent", "video", rect, true, containerItem);
}

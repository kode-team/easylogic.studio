export default function addVideo(editor, rect = {}, containerItem = undefined) {
  editor.context.commands.emit(
    "newComponent",
    "video",
    rect,
    true,
    containerItem
  );
}

export default function addImage(editor, rect = {}, containerItem = undefined) {
  editor.context.commands.emit(
    "newComponent",
    "image",
    rect,
    true,
    containerItem
  );
}

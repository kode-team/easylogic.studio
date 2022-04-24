/**
 * reset selecdtion command
 *
 * @param {Editor} editor
 */
export default function resetSelection(editor) {
  editor.emit("refreshSelectionTool");
}

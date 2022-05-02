import { REFRESH_SELECTION_TOOL } from "../../types/event";
/**
 * reset selecdtion command
 *
 * @param {Editor} editor
 */
export default function resetSelection(editor) {
  editor.emit(REFRESH_SELECTION_TOOL);
}

import { EDIT_MODE_SELECTION } from "../../editor/Editor";

export default function selectItem (editor) {
    editor.changeMode(EDIT_MODE_SELECTION);
    editor.emit('afterChangeMode');
}

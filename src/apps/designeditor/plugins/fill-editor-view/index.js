// import { Editor } from "elf/editor/manager/Editor";
import FillEditorView from "./FillEditorView";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("canvas.view", {
    FillEditorView,
  });
}

// import { Editor } from "elf/editor/manager/Editor";
import GradientEditorView from "./GradientEditorView";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("canvas.view", {
    GradientEditorView,
  });
}

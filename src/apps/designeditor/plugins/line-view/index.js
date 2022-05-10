// import { Editor } from "elf/editor/manager/Editor";
import LineView from "./LineView";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("canvas.view", {
    LineView,
  });
}

// import { Editor } from "elf/editor/manager/Editor";
import HoverView from "./HoverView";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("canvas.view", {
    HoverView,
  });
}

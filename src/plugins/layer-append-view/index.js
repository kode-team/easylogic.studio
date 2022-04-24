// import { Editor } from "elf/editor/manager/Editor";
import LayerAppendView from "./LayerAppendView";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("canvas.view", {
    LayerAppendView,
  });
}

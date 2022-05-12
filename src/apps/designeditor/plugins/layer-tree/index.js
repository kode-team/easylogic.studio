// import { Editor } from "elf/editor/manager/Editor";
import LayerTreeProperty from "./LayerTreeProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    LayerTreeProperty,
  });
}

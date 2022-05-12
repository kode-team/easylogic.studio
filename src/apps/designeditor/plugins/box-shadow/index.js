// import { Editor } from "elf/editor/manager/Editor";
import BoxShadowProperty from "./BoxShadowProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.style", {
    BoxShadowProperty,
  });
}

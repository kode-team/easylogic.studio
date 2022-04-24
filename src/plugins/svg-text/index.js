// import { Editor } from "elf/editor/manager/Editor";
import SVGTextProperty from "./SVGTextProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.style", {
    SVGTextProperty,
  });
}

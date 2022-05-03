// import { Editor } from "elf/editor/manager/Editor";
import FilterProperty from "./FilterProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.style", {
    FilterProperty,
  });
}

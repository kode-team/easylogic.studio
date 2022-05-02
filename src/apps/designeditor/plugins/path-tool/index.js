// import { Editor } from "elf/editor/manager/Editor";
import PathToolProperty from "./PathToolProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.style", {
    PathToolProperty,
  });
}

// import { Editor } from "elf/editor/manager/Editor";
import BackdropFilterProperty from "./BackdropFilterProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.style", {
    BackdropFilterProperty,
  });
}

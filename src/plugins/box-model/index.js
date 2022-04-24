// import { Editor } from "elf/editor/manager/Editor";
import BoxModelProperty from "./BoxModelProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.style", {
    BoxModelProperty,
  });
}

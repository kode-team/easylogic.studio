// import { Editor } from "elf/editor/manager/Editor";
import PositionProperty from "./PositionProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.style", {
    PositionProperty,
  });
}

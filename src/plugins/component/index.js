// import { Editor } from "elf/editor/manager/Editor";
import ComponentPopup from "./ComponentPopup";
import ComponentProperty from "./ComponentProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.style", {
    ComponentProperty,
  });

  editor.registerUI("popup", {
    ComponentPopup,
  });
}

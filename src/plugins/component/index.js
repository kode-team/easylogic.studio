// import { Editor } from "elf/editor/manager/Editor";
import ComponentProperty from "./ComponentProperty";
import ComponentPopup from "./ComponentPopup";

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

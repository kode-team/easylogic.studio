// import { Editor } from "elf/editor/manager/Editor";
import ImageProperty from "./ImageProperty";
import ImageSelectEditor from "./ImageSelectEditor";
import ImageSelectPopup from "./ImageSelectPopup";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    ImageSelectEditor,
  });
  editor.registerUI("inspector.tab.style", {
    ImageProperty,
  });

  editor.registerUI("popup", {
    ImageSelectPopup,
  });
}

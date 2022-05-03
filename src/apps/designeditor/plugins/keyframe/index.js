// import { Editor } from "elf/editor/manager/Editor";
import KeyframePopup from "./KeyframePopup";
import KeyframeProperty from "./KeyframeProperty";
import OffsetEditor from "./OffsetEditor";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    OffsetEditor,
  });

  editor.registerUI("inspector.tab.transition", {
    KeyframeProperty,
  });

  editor.registerUI("popup", {
    KeyframePopup,
  });
}

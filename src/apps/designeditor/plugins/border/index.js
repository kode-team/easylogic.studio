// import { Editor } from "elf/editor/manager/Editor";
import BorderEditor from "./BorderEditor";
import BorderProperty from "./BorderProperty";
import BorderValueEditor from "./BorderValueEditor";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    BorderEditor,
    BorderValueEditor,
  });
  editor.registerUI("inspector.tab.style", {
    BorderProperty,
  });
}

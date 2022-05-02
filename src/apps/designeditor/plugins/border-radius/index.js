// import { Editor } from "elf/editor/manager/Editor";
import BorderRadiusEditor from "./BorderRadiusEditor";
import BorderRadiusProperty from "./BorderRadiusProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    BorderRadiusEditor,
  });

  editor.registerUI("inspector.tab.style", {
    BorderRadiusProperty,
  });
}

// import { Editor } from "elf/editor/manager/Editor";
import ContentProperty from "./ContentProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    ContentProperty,
  });
}

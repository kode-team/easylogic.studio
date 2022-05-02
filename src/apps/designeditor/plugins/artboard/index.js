// import { Editor } from "elf/editor/manager/Editor";
import ArtBoardSizeProperty from "./ArtBoardSizeProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.style", {
    ArtBoardSizeProperty,
  });
}

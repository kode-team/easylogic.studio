// import { Editor } from "elf/editor/manager/Editor";
import BackgroundImageEditor from "./BackgroundImageEditor";
import BackgroundImagePositionPopup from "./BackgroundImagePositionPopup";
import BackgroundImageProperty from "./BackgroundImageProperty";
import BackgroundPositionEditor from "./BackgroundPositionEditor";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    BackgroundImageEditor,
    BackgroundPositionEditor,
  });

  editor.registerUI("inspector.tab.style", {
    BackgroundImageProperty,
  });

  editor.registerUI("popup", {
    BackgroundImagePositionPopup,
  });
}

// import { Editor } from "elf/editor/manager/Editor";
import AnimationProperty from "./AnimationProperty";
import AnimationPropertyPopup from "./AnimationPropertyPopup";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.transition", {
    AnimationProperty,
  });

  editor.registerUI("popup", {
    AnimationPropertyPopup,
  });
}

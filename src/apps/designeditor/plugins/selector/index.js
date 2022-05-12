import SelectorPopup from "./SelectorPopup";
import SelectorProperty from "./SelectorProperty";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.transition", {
    SelectorProperty,
  });

  editor.registerUI("popup", {
    SelectorPopup,
  });
}

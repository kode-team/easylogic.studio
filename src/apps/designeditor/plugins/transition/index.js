import TransitionProperty from "./TransitionProperty";
import TransitionPropertyPopup from "./TransitionPropertyPopup";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerUI("inspector.tab.transition", {
    TransitionProperty,
  });

  editor.registerUI("popup", {
    TransitionPropertyPopup,
  });
}

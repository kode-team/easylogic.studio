import Button from "./Button";
import ToggleCheckBox from "./ToggleCheckBox";
import ToggleButton from "./ToggleButton";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    ToggleCheckBox,
    ToggleButton,
    Button,
  });

  editor.registerAlias({
    "toggle-checkbox": "ToggleCheckBox",
    "toggle-button": "ToggleButton",
    button: "Button",
  });
}

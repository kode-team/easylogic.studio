import { Button, ToggleButton, ToggleCheckBox } from "elf/ui";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    Button,
    ToggleButton,
    ToggleCheckBox,
  });

  editor.registerAlias({
    "toggle-checkbox": "ToggleCheckBox",
    "toggle-button": "ToggleButton",
    button: "Button",
  });
}

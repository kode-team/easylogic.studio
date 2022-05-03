// import { Editor } from "elf/editor/manager/Editor";
import ColorPickerEditor from "./ColorPickerEditor";
import ColorPickerPopup from "./ColorPickerPopup";
import EmbedColorPicker from "./EmbedColorPicker";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    ColorPickerEditor,
    EmbedColorPicker,
  });
  editor.registerUI("popup", {
    ColorPickerPopup,
  });
}

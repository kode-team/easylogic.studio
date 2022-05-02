// import { Editor } from "elf/editor/manager/Editor";
import FillEditor from "./FillEditor";
import FillPickerPopup from "./FillPickerPopup";
import FillSingleEditor from "./FillSingleEditor";
import GradientPickerPopup from "./GradientPickerPopup";
import GradientSingleEditor from "./GradientSingleEditor";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    FillSingleEditor,
    FillEditor,
    GradientSingleEditor,
  });

  editor.registerAlias({
    "fill-single": "FillSingleEditor",
    fill: "FillEditor",
    "gradient-single": "GradientSingleEditor",
  });

  editor.registerUI("popup", {
    FillPickerPopup,
    GradientPickerPopup,
  });
}

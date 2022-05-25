// import { Editor } from "elf/editor/manager/Editor";
import PatternAssetsProperty from "../layertab/object-list/asset/PatternAssetsProperty";
import PatternEditor from "./PatternEditor";
import PatternInfoPopup from "./PatternInfoPopup";
import PatternProperty from "./PatternProperty";
import PatternSizeEditor from "./PatternSizeEditor";

/**
 *
 * @param {Editor} editor
 */
export default function (editor) {
  editor.registerElement({
    PatternEditor,
    PatternSizeEditor,
    PatternAssetsProperty,
  });

  editor.registerUI("inspector.tab.style", {
    PatternProperty,
  });

  editor.registerUI("popup", {
    PatternInfoPopup,
  });
}

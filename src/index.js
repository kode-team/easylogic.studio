import "./scss/index.scss";

import Util from "./util/index";
import ColorPicker from "./colorpicker/index";
import CSSEditor from "./csseditor/index";

function startEditor($target) {
  var editor = new CSSEditor.createCSSEditor({
    // embed: true
  });
  // editor.emit("setParser", function(canvasView) {
  //   return new CSSEditor.DomParserGenerator(
  //     canvasView,
  //     $target /* contenteditable */
  //   );
  // });

  editor.emit("load/start", true);

  return editor;
}

export default {
  ...Util,
  ...ColorPicker,
  ...CSSEditor,
  startEditor
};

// if (window.startEditor) {
startEditor(document.getElementById("target"));
// }

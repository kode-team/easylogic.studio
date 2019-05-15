import "./scss/index.scss";

import Util from "./util/index";
import ColorPicker from "./colorpicker/index";
import CSSEditor from "./csseditor/index";

const CSS = {
  // ...Util,
  // ...ColorPicker,
  ...CSSEditor
};

var editor = new CSS.createCSSEditor({
  // embed: true
});
// editor.emit("setParser", function(canvasView) {
//   return new CSS.DomParserGenerator(
//     canvasView,
//     document.getElementById("target") /* contenteditable */
//   );
// });

// picker.emit("setParser", function(canvasView) {
//   return new class {
//
//     parse() {
//       var data = {};
//
//       canvasView.parseEnd(data);
//     }
//
//      generate (cssObject) {
//
//      }
//   }();
// });

editor.emit("load/start", true);

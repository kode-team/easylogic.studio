import "./scss/index.scss";

import Util from "./util/index";
import ColorPicker from "./colorpicker/index";
import CSSEditor from "./csseditor/index";

function startEditor() {
  var editor = new CSSEditor.createCSSEditor();

  return editor;
}

export default {
  ...Util,
  ...ColorPicker,
  ...CSSEditor,
  startEditor
};

window.editor = startEditor();

import "./scss/index.scss";

import Util from "./core/index";
import ColorPicker from "./colorpicker/index";
import CSSEditor from "./csseditor/index";

function startEditor() {
  var app = new CSSEditor.createCSSEditor();

  return app;
}

export default {
  version: '@@VERSION@@',
  ...Util,
  ...ColorPicker,
  ...CSSEditor,
  startEditor
};

window.EasylogicEditor = startEditor();

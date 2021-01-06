import "./scss/index.scss";

import Util from "./core/index";
import ColorPicker from "./colorpicker/index";
import EasyLogic from "./designeditor/index";

function startEditor() {
  var app = new EasyLogic.createDesignEditor();

  return app;
}

export default {
  version: '@@VERSION@@',
  ...Util,
  ...ColorPicker,
  ...EasyLogic,
  startEditor
};

window.EasylogicEditor = startEditor();

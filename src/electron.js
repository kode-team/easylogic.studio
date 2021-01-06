import "./scss/index.scss";

import Util from "./core/index";
import ColorPicker from "./colorpicker/index";
import EasyLogic from "./designeditor/index";

function startEditor() {
  var editor = new EasyLogic.createDesignEditor();

  return editor;
}

export default {
  version: '@@VERSION@@',
  ...Util,
  ...ColorPicker,
  ...EasyLogic,
  startEditor
};

window.editor = startEditor();

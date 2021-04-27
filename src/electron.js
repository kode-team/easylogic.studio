import "./scss/index.scss";

import Util from "./el/base/index";
import EasyLogic from "./editor-layouts/designeditor/index";

function startEditor() {
  var editor = new EasyLogic.createDesignEditor();

  return editor;
}

export default {
  version: '@@VERSION@@',
  ...Util,
  ...EasyLogic,
  startEditor
};

window.editor = startEditor();

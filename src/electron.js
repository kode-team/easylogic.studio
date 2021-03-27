import "./scss/index.scss";

import Util from "./sapa/index";
import EasyLogic from "./designeditor/index";

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

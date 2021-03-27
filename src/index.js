import "./scss/index.scss";

import Util from "./sapa/index";
import EasyLogic from "./designeditor/index";

function startEditor() {
  var app = new EasyLogic.createDesignEditor();

  return app;
}

export default {
  version: '@@VERSION@@',
  ...Util,
  ...EasyLogic,
  startEditor
};

window.EasylogicEditor = startEditor();

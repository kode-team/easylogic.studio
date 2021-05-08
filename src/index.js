import "./scss/index.scss";

import Util from "./el/base/index";
import EasyLogic from "./editor-layouts/designeditor/index";

function startEditor() {
  var app = new EasyLogic.createDesignEditor({
    plugins: [
      function (editor) {
        console.log(editor);
      }
    ]
  });

  return app;
}

export default {
  version: '@@VERSION@@',
  ...Util,
  ...EasyLogic,
  startEditor
};

window.EasylogicEditor = startEditor();

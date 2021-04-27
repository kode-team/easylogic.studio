import "./scss/index.scss";

import EasyLogic from "./editor-layouts/singleeditor/index";

function startSingleEditor(opt = {}) {
  var app = new EasyLogic.createSingleEditor(opt);

  return app;
}

window.EasylogicEditor = startSingleEditor({
  container: document.getElementById('app')
});

import "./scss/index.scss";

import EasyLogic from "./editor-layouts/designplayer/index";

function startPlayer(opt = {}) {
  var app = new EasyLogic.createDesignPlayer(opt);

  return app;
}

window.EasylogicEditor = startPlayer({
  container: document.getElementById('app')
});

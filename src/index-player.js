import "./scss/index.scss";

import Util from "./core/index";
import EasyLogic from "./designplayer/index";

function startPlayer() {
  var app = new EasyLogic.createDesignPlayer();

  return app;
}

export default {
  version: '@@VERSION@@',
  ...Util,
  ...EasyLogic,
  startPlayer
};

window.EasylogicEditor = startPlayer();

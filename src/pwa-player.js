import "./scss/index.scss";

import Util from "./sapa/index";
import EasyLogic from "./designplayer/index";

function startPlayer() {

  var app = new EasyLogic.createDesignPlayer({
    version: '@@VERSION@@'
  });

  return app;
}

export default {
  version: '@@VERSION@@',
  ...Util,
  ...EasyLogic,
  startPlayer
};

window.EasylogicEditor = startPlayer();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}




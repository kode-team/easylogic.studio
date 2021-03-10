import "./scss/index.scss";

import Util from "./core/index";
import EasyLogic from "./designeditor/index";

function startEditor() {

  // 시작 지점을 고쳐보자. 
  var app = new EasyLogic.createDesignEditor({
    version: '@@VERSION@@'
  });
  // app.commands.registerCommand('sample.ok', () => {
  //   alert('샘플 ok');
  // })

  // app.emit('sample.ok');

  return app;
}

export default {
  version: '@@VERSION@@',
  ...Util,
  ...EasyLogic,
  startEditor
};

window.EasylogicEditor = startEditor();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

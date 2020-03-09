import "./scss/index.scss";

import Util from "./util/index";
import ColorPicker from "./colorpicker/index";
import CSSEditor from "./csseditor/index";

function startEditor() {

  // 시작 지점을 고쳐보자. 
  var app = new CSSEditor.createCSSEditor();
  // app.commands.registerCommand('sample.ok', () => {
  //   alert('샘플 ok');
  // })

  // app.emit('sample.ok');

  return app;
}

export default {
  version: '@@VERSION@@',
  ...Util,
  ...ColorPicker,
  ...CSSEditor,
  startEditor
};

window.editor = startEditor();

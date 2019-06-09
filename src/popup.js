import "./scss/index.scss";

import Util from "./util/index";
import ColorPicker from "./colorpicker/index";
import CSSEditor from "./csseditor/index";

const CSS = {
  ...Util,
  ...ColorPicker,
  ...CSSEditor
};

var picker = new CSS.createCSSEditor({
  // embed: true
});
// picker.emit("load/start", true);

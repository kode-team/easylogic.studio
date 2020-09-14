import "./scss/index.scss";

import Util from "./core/index";
import ColorPicker from "./colorpicker/index";
import CSSEditor from "./csseditor/index";

const CSS = {
  version: '@@VERSION@@',  
  ...Util,
  ...ColorPicker,
  ...CSSEditor
};

new CSS.createCSSEditor({
});

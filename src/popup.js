import "./scss/index.scss";

import Util from "./core/index";
import ColorPicker from "./colorpicker/index";
import EasyLogic from "./designeditor/index";

const CSS = {
  version: '@@VERSION@@',  
  ...Util,
  ...ColorPicker,
  ...EasyLogic,  
};

new EasyLogic.createDesignEditor();
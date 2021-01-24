import "./scss/index.scss";

import Util from "./core/index";
import EasyLogic from "./designeditor/index";

const CSS = {
  version: '@@VERSION@@',  
  ...Util,
  ...EasyLogic,  
};

new EasyLogic.createDesignEditor();
import MenuItem from "./MenuItem";

import { registElement } from "el/sapa/functions/registElement";
import { SUBSCRIBE } from "el/sapa/Event";
 
export default class AddText extends MenuItem {
  getIconString() {
    return 'title';
  }
  getTitle() { 
    return this.props.title || "Text";
  }

  getClassName() {
    return 'text'
  }

  clickButton(e) {
    this.emit('addLayerView', 'text');
  }

  [SUBSCRIBE('addLayerView')] (type) {
    this.setSelected(type === 'text');
  }    

  isHideTitle() {
    return true; 
  }

}

registElement({ AddText })

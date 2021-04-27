import MenuItem from "./MenuItem";

import { registElement } from "el/base/registElement";
import { SUBSCRIBE } from "el/base/Event";
 
export default class SelectTool extends MenuItem {
  getIconString() {
    return 'navigation';
  }
  
  getTitle() {
    return this.props.title || "Select";
  }

  clickButton(e) {
    this.emit('addLayerView', 'select');
  }

  [SUBSCRIBE('addLayerView')] (type) {
    this.setSelected(type === 'select');
  }      

  isHideTitle() {
    return true;
  }
}

registElement({ SelectTool })
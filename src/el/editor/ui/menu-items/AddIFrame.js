import MenuItem from "./MenuItem";

import { registElement } from "el/base/registerElement";
import { SUBSCRIBE } from "el/base/Event";
 
export default class AddIFrame extends MenuItem {
  getIconString() {
    return 'web';
  }
  getTitle() {
    return this.props.title || "IFrame";
  }

  clickButton(e) {
    this.emit('addLayerView', 'iframe');
  }

  [SUBSCRIBE('addLayerView')] (type) {
    this.setSelected(type === 'iframe');
  }
}

registElement({ AddIFrame })
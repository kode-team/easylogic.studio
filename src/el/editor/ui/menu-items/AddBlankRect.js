import MenuItem from "./MenuItem";

import { registElement } from "el/sapa/functions/registElement";
import { SUBSCRIBE } from "el/sapa/Event";
 
export default class AddBlankRect extends MenuItem {
  getIconString() {
    return 'rect';
  }
  getTitle() {
    return this.props.title || "Rect";
  }

  clickButton(e) {
    this.emit('addLayerView', 'rect', {
      'background-color': 'transparent'
    });
  }

  [SUBSCRIBE('addLayerView')] (type) {
    this.setSelected(type === 'rect');
  }

  isHideTitle() {
    return true;
  }
}

registElement({ AddBlankRect })
import MenuItem from "./MenuItem";

import { registElement } from "el/sapa/functions/registElement";
import { SUBSCRIBE } from "el/sapa/Event";
 
export default class AddDrawBrush extends MenuItem {
  getIconString() {
    return 'brush';
  }
  getTitle() {
    return this.props.title || "draw a brush";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('addLayerView', 'brush')
  }

  [SUBSCRIBE('addLayerView')] (type) {
    this.setSelected(type === 'brush');
  }    
}

registElement({ AddDrawBrush })

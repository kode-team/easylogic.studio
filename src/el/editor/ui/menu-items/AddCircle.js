import MenuItem from "./MenuItem";

import { registElement } from "el/base/registerElement";
import { SUBSCRIBE } from "el/base/Event";
   
export default class AddCircle extends MenuItem {
  getIconString() {
    return 'lens'
  }
  getTitle() {
    return this.props.title || "Circle";
  }

  clickButton(e) {
    this.emit('addLayerView', 'circle');    
  }

  [SUBSCRIBE('addLayerView')] (type) {
    this.setSelected(type === 'circle');
  }  

}

registElement({ AddCircle })
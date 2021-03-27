import MenuItem from "./MenuItem";
import { EVENT } from "@sapa/UIElement";
import { registElement } from "@sapa/registerElement";
   
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

  [EVENT('addLayerView')] (type) {
    this.setSelected(type === 'circle');
  }  

}

registElement({ AddCircle })
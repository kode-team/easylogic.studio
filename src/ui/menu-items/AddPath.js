import MenuItem from "./MenuItem";
import { EVENT } from "@sapa/UIElement";
import { registElement } from "@sapa/registerElement";
 
export default class AddPath extends MenuItem {
  getIconString() {
    return 'pentool';
  }
  getTitle() {
    return this.props.title || "Path";
  }

  clickButton(e) {
    this.emit('addLayerView', 'path')
  }

  [EVENT('addLayerView')] (type) {
    this.setSelected(type === 'path');
  }    
}

registElement({ AddPath })
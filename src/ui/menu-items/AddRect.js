import MenuItem from "./MenuItem";
import { EVENT } from "@sapa/UIElement";
import { registElement } from "@sapa/registerElement";
 
export default class AddRect extends MenuItem {
  getIconString() {
    return 'rect';
  }
  getTitle() {
    return this.props.title || "Rect";
  }

  clickButton(e) {
    this.emit('addLayerView', 'rect');
  }

  [EVENT('addLayerView')] (type) {
    this.setSelected(type === 'rect');
  }
}

registElement({ AddRect })
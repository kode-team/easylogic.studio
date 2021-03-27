import MenuItem from "./MenuItem";
import { EVENT } from "@sapa/UIElement";
import { registElement } from "@sapa/registerElement";
 
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

  [EVENT('addLayerView')] (type) {
    this.setSelected(type === 'iframe');
  }
}

registElement({ AddIFrame })
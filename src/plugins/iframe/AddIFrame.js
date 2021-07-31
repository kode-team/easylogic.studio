import { SUBSCRIBE } from "el/sapa/Event";
import MenuItem from "el/editor/ui/menu-items/MenuItem";
 
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

  isHideTitle() {
    return true;
  }
}
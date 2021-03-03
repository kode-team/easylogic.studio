import MenuItem from "./MenuItem";
import { EVENT } from "@core/UIElement";
 
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

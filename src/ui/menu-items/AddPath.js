import MenuItem from "./MenuItem";
import icon from "@icon/icon";
import { EVENT } from "@core/UIElement";
 
export default class AddPath extends MenuItem {
  getIconString() {
    return icon.pentool;
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

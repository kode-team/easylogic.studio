import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddRect extends MenuItem {
  getIconString() {
    return icon.rect;
  }
  getTitle() {
    return this.props.title || "Rect";
  }

  clickButton(e) {

    this.emit('addLayerView', 'rect');
  }
}

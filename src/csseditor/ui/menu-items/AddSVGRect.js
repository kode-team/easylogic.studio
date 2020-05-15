import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddSVGRect extends MenuItem {
  getIconString() {
    return icon.outline_rect;
  }
  getTitle() {
    return this.props.title || "Rect";
  }
 

  clickButton(e) {
    this.emit('addComponentType', 'svg-rect');
  }

}

import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddSVGRect extends MenuItem {
  getIconString() {
    return icon.rect;
  }
  getTitle() {
    return this.props.title || "SVG Rect";
  }
 

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('addComponentType', 'svg-rect');
  }

}

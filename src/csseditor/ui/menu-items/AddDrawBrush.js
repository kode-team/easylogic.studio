import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddDrawBrush extends MenuItem {
  getIconString() {
    return icon.brush;
  }
  getTitle() {
    return this.props.title || "draw a brush";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('addDrawBrush')
  }

}

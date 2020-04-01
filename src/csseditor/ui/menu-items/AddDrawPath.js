import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddDrawPath extends MenuItem {
  getIconString() {
    return icon.edit;
  }
  getTitle() {
    return this.props.title || "draw a path";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('addDrawPath')
  }

}

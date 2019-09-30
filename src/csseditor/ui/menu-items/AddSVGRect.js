import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddSVGRect extends MenuItem {
  getIconString() {
    return icon.rect;
  }
  getTitle() {
    return "6. SVG Rect";
  }
 

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('add.type', 'svgrect');
  }

}

import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddRect extends MenuItem {
  getIconString() {
    return icon.rect;
  }
  getTitle() {
    return "1. Rect";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {

    this.emit('add.type', 'rect');

    // this.emit('add.rect')
  }
}

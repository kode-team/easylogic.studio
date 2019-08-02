import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddText extends MenuItem {
  getIconString() {
    return icon.title;
  }
  getTitle() { 
    return "3. Text";
  }

  isHideTitle() {
    return true; 
  }

  clickButton(e) {

    this.emit('add.type', 'text');
    // this.emit('add.text')
  }

}

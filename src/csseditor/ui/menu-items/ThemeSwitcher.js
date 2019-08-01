import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class ThemeSwitcher extends MenuItem {
  getIconString() {
    return icon.color_lens;
  }
  getTitle() {
    return "Theme";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('switch.theme')
  }
}

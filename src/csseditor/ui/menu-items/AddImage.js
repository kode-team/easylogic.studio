import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddImage extends MenuItem {

  getIconString() {
    return icon.outline_image;
  }

  getTitle() {
    return "4. Image";
  }

  isHideTitle() {
    return true; 
  }

  clickButton() {
    this.emit('add.type', 'image');
  }

}

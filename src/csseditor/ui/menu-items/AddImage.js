import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddImage extends MenuItem {

  getIconString() {
    return icon.photo;
  }

  getTitle() {
    return this.props.title || "Image";
  }

  isHideTitle() {
    return true; 
  }

  clickButton() {
    this.emit('addComponentType', 'image');
  }

}

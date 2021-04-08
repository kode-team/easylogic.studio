import { registElement } from "el/base/registerElement";
import MenuItem from "./MenuItem";
 
export default class AddImage extends MenuItem {

  getIconString() {
    return 'photo';
  }

  getTitle() {
    return this.props.title || "Image";
  }

  clickButton() {
    this.emit('addLayerView', 'image');
  }

  isHideTitle() {
    return true;
  }

}

registElement({ AddImage })
import { registElement } from "@sapa/registerElement";
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

}

registElement({ AddImage })
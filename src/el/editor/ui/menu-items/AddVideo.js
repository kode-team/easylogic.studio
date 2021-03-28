import { registElement } from "el/base/registerElement";
import MenuItem from "./MenuItem";
 
export default class AddVideo extends MenuItem {

  getIconString() {
    return 'video';
  }

  getTitle() {
    return this.props.title || "Video";
  }

  clickButton() {
    this.emit('addLayerView', 'video');
  }

}

registElement({ AddVideo })
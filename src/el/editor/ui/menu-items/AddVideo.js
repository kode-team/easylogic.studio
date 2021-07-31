import { registElement } from "el/sapa/functions/registElement";
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

  isHideTitle() {
    return true;
  }

}

registElement({ AddVideo })
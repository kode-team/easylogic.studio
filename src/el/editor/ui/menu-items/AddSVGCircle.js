import { registElement } from "el/base/registerElement";
import MenuItem from "./MenuItem";
 
export default class AddSVGCircle extends MenuItem {
  getIconString() {
    return 'outline_circle';
  }
  getTitle() {
    return this.props.title || "CirclePath";
  }
 

  clickButton(e) {
    this.emit('addLayerView', 'svg-circle');
  }

  isHideTitle() {
    return true;
  }

}


registElement({ AddSVGCircle })
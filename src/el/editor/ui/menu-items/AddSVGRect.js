import { registElement } from "el/base/registerElement";
import MenuItem from "./MenuItem";
 
export default class AddSVGRect extends MenuItem {
  getIconString() {
    return 'outline_rect';
  }
  getTitle() {
    return this.props.title || "RectPath";
  }
 

  clickButton(e) {
    this.emit('addLayerView', 'svg-rect');
  }

  isHideTitle() {
    return true;
  }

}

registElement({ AddSVGRect })

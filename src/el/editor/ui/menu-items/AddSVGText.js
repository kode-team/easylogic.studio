import { registElement } from "el/base/registerElement";
import MenuItem from "./MenuItem";
 
export default class AddSVGText extends MenuItem {
  getIconString() {
    return 'title';
  }
  getTitle() {
    return this.props.title || "SVGText";
  }
 
  clickButton(e) {
    this.emit('addLayerView', 'svg-text');
  }

  isHideTitle() {
    return true;
  }

}


registElement({ AddSVGText })
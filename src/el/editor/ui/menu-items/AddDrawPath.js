import { registElement } from "el/base/registerElement";
import MenuItem from "./MenuItem";
 
export default class AddDrawPath extends MenuItem {
  getIconString() {
    return 'edit';
  }
  getTitle() {
    return this.props.title || "Draw";
  }

  clickButton(e) {
    this.emit('addLayerView', 'brush')
  }

  isHideTitle() {
     return true;
  }

}

registElement({ AddDrawPath })
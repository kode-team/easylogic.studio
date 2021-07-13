import { registElement } from "el/base/registElement";
import MenuItem from "./MenuItem";
 
export default class AddDrawPath extends MenuItem {
  getIconString() {
    return 'draw';
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
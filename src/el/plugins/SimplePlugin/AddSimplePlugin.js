import MenuItem from "el/editor/ui/menu-items/MenuItem";
import { SIMPLE_TYPE } from "./constants";
import icon from "./icon";

export default class AddSimplePlugin extends MenuItem {
  getIconString() {
    return icon
  }

  getTitle() {
    return this.props.title || "Simple Plugin S";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('addLayerView', SIMPLE_TYPE, { 
      option: [1, 2, 3]
    });
  }

}
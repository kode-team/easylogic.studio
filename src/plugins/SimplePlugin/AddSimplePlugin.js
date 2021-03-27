import MenuItem from "@ui/menu-items/MenuItem";
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
    this.emit('addLayerView', 'simple', { 
      option: [1, 2, 3]
    });
  }

}
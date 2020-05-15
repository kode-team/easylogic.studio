import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddText extends MenuItem {
  getIconString() {
    return icon.title;
  }
  getTitle() { 
    return this.props.title || "Text";
  }

  getClassName() {
    return 'text'
  }

  clickButton(e) {
    this.emit('addComponentType', 'text');
  }

}

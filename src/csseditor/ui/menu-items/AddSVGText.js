import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddSVGText extends MenuItem {
  getIconString() {
    return icon.title;
  }
  getTitle() {
    return this.props.title || "Text";
  }
 
  clickButton(e) {
    this.emit('addComponentType', 'svgtext');
  }

}

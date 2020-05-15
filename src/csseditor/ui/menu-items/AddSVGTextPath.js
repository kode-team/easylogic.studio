import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddSVGTextPath extends MenuItem {
  getIconString() {
    return icon.text_rotate;
  }
  getTitle() {
    return this.props.title || "TextPath";
  }
 
  clickButton(e) {
    this.emit('addComponentType', 'svg-textpath');
  }

}

import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddPath extends MenuItem {
  getIconString() {
    return icon.pentool;
  }
  getTitle() {
    return this.props.title || "Path";
  }

  clickButton(e) {
    this.emit('addPathView')
  }

}

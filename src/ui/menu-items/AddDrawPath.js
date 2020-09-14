import MenuItem from "./MenuItem";
import icon from "@icon/icon";
 
export default class AddDrawPath extends MenuItem {
  getIconString() {
    return icon.edit;
  }
  getTitle() {
    return this.props.title || "Draw";
  }

  clickButton(e) {
    this.emit('addLayerView', 'brush')
  }

}

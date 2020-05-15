import MenuItem from "./MenuItem";
import icon from "../icon/icon";
   
export default class AddCircle extends MenuItem {
  getIconString() {
    return icon.lens
  }
  getTitle() {
    return this.props.title || "Circle";
  }

  clickButton(e) {

    this.emit('addComponentType', 'circle');    

  }

}

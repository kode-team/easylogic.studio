import MenuItem from "./MenuItem";
import icon from "@icon/icon";
import { EVENT } from "@core/UIElement";
   
export default class AddCircle extends MenuItem {
  getIconString() {
    return icon.lens
  }
  getTitle() {
    return this.props.title || "Circle";
  }

  clickButton(e) {
    this.emit('addLayerView', 'circle');    
  }

  [EVENT('addLayerView')] (type) {
    this.setSelected(type === 'circle');
  }  

}

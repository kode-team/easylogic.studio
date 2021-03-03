import MenuItem from "./MenuItem";
import { EVENT } from "@core/UIElement";
   
export default class AddCircle extends MenuItem {
  getIconString() {
    return 'lens'
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

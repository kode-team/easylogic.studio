import MenuItem from "./MenuItem";
import { EVENT } from "@core/UIElement";
 
export default class AddDrawBrush extends MenuItem {
  getIconString() {
    return 'brush';
  }
  getTitle() {
    return this.props.title || "draw a brush";
  }

  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.emit('addLayerView', 'brush')
  }

  [EVENT('addLayerView')] (type) {
    this.setSelected(type === 'brush');
  }    
}

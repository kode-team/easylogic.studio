import MenuItem from "./MenuItem";
import { EVENT } from "@core/UIElement";
 
export default class SelectTool extends MenuItem {
  getIconString() {
    return 'navigation';
  }
  
  getTitle() {
    return this.props.title || "Select";
  }

  clickButton(e) {
    this.emit('addLayerView', 'select');
  }

  [EVENT('addLayerView')] (type) {
    this.setSelected(type === 'select');
  }      
}

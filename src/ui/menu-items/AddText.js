import MenuItem from "./MenuItem";
import { EVENT } from "@core/UIElement";
import { registElement } from "@core/registerElement";
 
export default class AddText extends MenuItem {
  getIconString() {
    return 'title';
  }
  getTitle() { 
    return this.props.title || "Text";
  }

  getClassName() {
    return 'text'
  }

  clickButton(e) {
    this.emit('addLayerView', 'text');
  }

  [EVENT('addLayerView')] (type) {
    this.setSelected(type === 'text');
  }    

}

registElement({ AddText })

import MenuItem from "./MenuItem";
import { EVENT } from "@sapa/UIElement";
import { registElement } from "@sapa/registerElement";
 
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

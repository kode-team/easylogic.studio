import MenuItem from "./MenuItem";

import { registElement } from "el/sapa/functions/registElement";
import { CONFIG, SUBSCRIBE } from "el/sapa/Event";
import { EditingMode } from "el/editor/types/editor";
 
export default class AddRect extends MenuItem {
  getIconString() {
    return 'rect';
  }
  getTitle() {
    return this.props.title || "Rect";
  }

  clickButton(e) {
    this.emit('addLayerView', 'rect');
  }

  isHideTitle() {
    return true;
  }


  doSelect() {
    this.setSelected(
      this.$config.is("editing.mode", EditingMode.APPEND) && 
      this.$config.is("editing.mode.itemType", 'rect')
    );
  }

  [CONFIG('editing.mode')] () {
    this.doSelect();
  }

  [CONFIG('editing.mode.itemType')] () {
    this.doSelect();
  }    
}

registElement({ AddRect })
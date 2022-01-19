import MenuItem from "./MenuItem";

import { registElement } from "el/sapa/functions/registElement";
import { CONFIG, SUBSCRIBE } from "el/sapa/Event";
import { EditingMode } from "el/editor/types/editor";
 
export default class AddArtboard extends MenuItem {
  getIconString() {
    return 'artboard';
  }
  getTitle() {
    return this.props.title || "ArtBoard";
  }

  clickButton(e) {
    this.emit('addLayerView', 'artboard');
  }

  isHideTitle() {
    return true; 
  }

  doSelect() {
    this.setSelected(
      this.$config.is("editing.mode", EditingMode.APPEND) && 
      this.$config.is("editing.mode.itemType", 'artboard')
    );
  }

  [CONFIG('editing.mode')] () {
    this.doSelect();
  }

  [CONFIG('editing.mode.itemType')] () {
    this.doSelect();
  }  
}

registElement({ AddArtboard })
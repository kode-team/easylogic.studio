import MenuItem from "./MenuItem";

import { registElement } from "el/sapa/functions/registElement";
import { SUBSCRIBE } from "el/sapa/Event";
 
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

  [SUBSCRIBE('addLayerView')] (type) {
    this.setSelected(type === 'artboard');
  }  
}

registElement({ AddArtboard })
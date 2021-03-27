import MenuItem from "./MenuItem";
import { EVENT } from "@sapa/UIElement";
import { registElement } from "@sapa/registerElement";
 
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

  [EVENT('addLayerView')] (type) {
    this.setSelected(type === 'artboard');
  }  
}

registElement({ AddArtboard })
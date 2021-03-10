import MenuItem from "./MenuItem";
import { EVENT } from "@core/UIElement";
import { registElement } from "@core/registerElement";
 
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
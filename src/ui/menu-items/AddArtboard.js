import MenuItem from "./MenuItem";
import icon from "@icon/icon";
import { EVENT } from "@core/UIElement";
 
export default class AddArtboard extends MenuItem {
  getIconString() {
    return icon.artboard;
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

import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddVideo extends MenuItem {

  getIconString() {
    return icon.video;
  }

  getTitle() {
    return this.props.title || "Video";
  }

  clickButton() {
    this.emit('addLayerView', 'video');
  }

}

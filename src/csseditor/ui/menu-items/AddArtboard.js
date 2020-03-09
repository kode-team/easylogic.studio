import MenuItem from "./MenuItem";
import icon from "../icon/icon";
 
export default class AddArtboard extends MenuItem {
  getIconString() {
    return icon.artboard;
  }
  getTitle() {
    return this.props.title || "Artboard";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {

    this.emit('addArtBoard');
  }
}

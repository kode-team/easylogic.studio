import MenuItem from "./MenuItem";
import icon from "../../icon/icon";
import { EVENT } from "../../../../util/UIElement";
 
export default class AddImage extends MenuItem {
  getIconString() {
    return icon.outline_image;
  }
  getTitle() {
    return "4. Image";
  }

  isHideTitle() {
    return true; 
  }


  [EVENT('changeImageSelectEditor')] (value, info) {

    this.emit('add.image', value, info)

 }  

  clickButton(e) {
    this.emit('hideSubEditor');    
    // open image popup
    this.emit('showImageSelectPopup', {
      context: this, 
      changeEvent: 'changeImageSelectEditor'
    })
  }
}

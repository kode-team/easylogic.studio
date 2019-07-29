import MenuItem from "./MenuItem";
import icon from "../../icon/icon";
import { ImageLayer } from "../../../../editor/items/layers/ImageLayer";
import { editor } from "../../../../editor/editor";
import { Length } from "../../../../editor/unit/Length";
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

    var artboard = editor.selection.currentArtboard

    if (artboard) {
      var layer = artboard.add(new ImageLayer({
        ...info,
        src: value 
      }))

      editor.selection.select(layer);

      this.emit('refreshAll')
      this.emit('refreshSelection');
    }

 }  

  clickButton(e) {
    this.trigger('addImage')
  }

  [EVENT('addImage')] () {
    this.emit('hideSubEditor');    
    // open image popup
    this.emit('showImageSelectPopup', {
      context: this, 
      changeEvent: 'changeImageSelectEditor'
    })

  }
}

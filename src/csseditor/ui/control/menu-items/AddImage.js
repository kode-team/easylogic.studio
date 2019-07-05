import MenuItem from "./MenuItem";
import icon from "../../icon/icon";
import { ImageLayer } from "../../../../editor/items/layers/ImageLayer";
import { editor } from "../../../../editor/editor";
import { Length } from "../../../../editor/unit/Length";
 
export default class AddImage extends MenuItem {
  getIconString() {
    return icon.outline_image;
  }
  getTitle() {
    return "Image";
  }

  clickButton(e) {
    var artboard = editor.selection.currentArtboard

    if (artboard) {
      var layer = artboard.add(new ImageLayer({
        width: Length.px(100),
        height: Length.px(100)
      }))

      editor.selection.select(layer);

      this.emit('refreshAll')
      this.emit('refreshSelection');
    }
  }
}

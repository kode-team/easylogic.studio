import MenuItem from "./MenuItem";
import icon from "../../icon/icon";
import { editor } from "../../../../editor/editor";
import { Length } from "../../../../editor/unit/Length";
import { RedGLLayer } from "../../../../editor/items/layers/canvas/RedGLLayer";
 
export default class AddRedGL extends MenuItem {
  getIconString() {
    return icon.outline_image;
  }
  getTitle() {
    return "RedGL";
  }

  clickButton(e) {
    var artboard = editor.selection.currentArtboard

    if (artboard) {
      var layer = artboard.add(new RedGLLayer({
        width: Length.px(100),
        height: Length.px(100)
      }))

      editor.selection.select(layer);

      this.emit('refreshAll')
      this.emit('refreshSelection');
    }
  }
}

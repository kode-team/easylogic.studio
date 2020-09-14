import MenuItem from "./MenuItem";
import icon from "@icon/icon";
import { Length } from "@unit/Length";
import { RedGLLayer } from "@items/layers/canvas/RedGLLayer";
 
export default class AddRedGL extends MenuItem {
  getIconString() {
    return icon.outline_image;
  }
  getTitle() {
    return "RedGL";
  }

  clickButton(e) {
    var artboard = this.$selection.currentArtboard

    if (artboard) {
      var layer = artboard.add(new RedGLLayer({
        width: Length.px(100),
        height: Length.px(100)
      }))

      this.$selection.select(layer);

      this.emit('refreshAll')
      this.emit('refreshSelection');
    }
  }
}

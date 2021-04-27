import MenuItem from "./MenuItem";
import { Length } from "el/editor/unit/Length";
import { RedGLLayer } from "@items/layers/canvas/RedGLLayer";
import { registElement } from "el/base/registElement";
 
export default class AddRedGL extends MenuItem {
  getIconString() {
    return 'outline_image';
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

registElement({ AddRedGL })

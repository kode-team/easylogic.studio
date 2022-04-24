import MenuItem from "./MenuItem";
import { Length } from "elf/editor/unit/Length";
import { RedGLLayer } from "@items/layers/canvas/RedGLLayer";
import { registElement } from "sapa";
 
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
        width: 100,
        height: 100
      }))

      this.$selection.select(layer);

      this.emit('refreshAll')
      this.emit('refreshSelection');
    }
  }
}

registElement({ AddRedGL })

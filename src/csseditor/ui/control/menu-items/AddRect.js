import MenuItem from "./MenuItem";
import { editor } from "../../../../editor/editor";
import { Layer } from "../../../../editor/items/Layer";

import { Length } from "../../../../editor/unit/Length";
import Color from "../../../../util/Color";
import { EVENT } from "../../../../util/UIElement";
 
export default class AddRect extends MenuItem {
  getIcon() {
    return 'rect';
  }
  getTitle() {
    return "1. Rect";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.trigger('addRect')
  }

  [EVENT('addRect')] () {
    var artboard = editor.selection.currentArtboard

    if (artboard) {
      var layer = artboard.add(new Layer({
        width: Length.px(100),
        height: Length.px(100),
        'background-color': Color.random()
      }))

      editor.selection.select(layer);

      this.emit('refreshAll')
      this.emit('refreshSelection');
      this.emit('hideSubEditor');
    }
  }
}

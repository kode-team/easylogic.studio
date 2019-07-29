import MenuItem from "./MenuItem";
import { editor } from "../../../../editor/editor";
import { Layer } from "../../../../editor/items/Layer";
import icon from "../../icon/icon";

import { Length } from "../../../../editor/unit/Length";
import Color from "../../../../util/Color";
import { EVENT } from "../../../../util/UIElement";
   
export default class AddCircle extends MenuItem {
  getIcon() {
    return 'circle';
  }
  getTitle() {
    return "2. Circle";
  }


  isHideTitle() {
    return true; 
  }  

  clickButton(e) {
    this.trigger('addCircle');
  }

  [EVENT('addCircle')] () {

    var artboard = editor.selection.currentArtboard

    if (artboard) {
      var layer = artboard.add(new Layer({
        width: Length.px(100),
        height: Length.px(100),
        'background-color': Color.random(),
        'border-radius': 'border-radius: 100%'
      }))

      editor.selection.select(layer);

      this.emit('refreshAll')
      this.emit('refreshSelection');
      this.emit('hideSubEditor');          
    }
  }
}

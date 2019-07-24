import MenuItem from "./MenuItem";
import { editor } from "../../../../editor/editor";
import { TextLayer } from "../../../../editor/items/layers/TextLayer";
import icon from "../../icon/icon";
import { Length } from "../../../../editor/unit/Length";
 
export default class AddText extends MenuItem {
  getIconString() {
    return icon.title;
  }
  getTitle() { 
    return "Text";
  }

  isHideTitle() {
    return true; 
  }

  clickButton(e) {
    this.emit('hideSubEditor');    
    var artboard = editor.selection.currentArtboard

    if (artboard) {
      var layer = artboard.add(new TextLayer({
        content: 'Insert a text',
        width: Length.px(300),
        height: Length.px(50),
        'font-size': Length.px(30)
      }))

      editor.selection.select(layer);

      this.emit('refreshAll')
      this.emit('refreshSelection');
    }
  }
}

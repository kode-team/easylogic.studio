import { DEBOUNCE, SUBSCRIBE } from "el/sapa/Event";
import MenuItem from "./MenuItem";
   
export default class OpenPathEditor extends MenuItem {
  getIconString() {
    return 'shape';
  }
  getTitle() {
    return "Edit";
  }

  isHideTitle() {
    return true; 
  }

  clickButton(e) {
    this.emit('open.editor');
  }

  [SUBSCRIBE('refreshSelection') + DEBOUNCE(100)] () {
    const enablePathEditing = this.$selection.is("svg-path", "svg-textpath") || this.$selection.current?.cacheClipPathObject?.type === 'path';

    if (enablePathEditing) {
      this.$el.show('inline-block');       
    } else {
      this.$el.hide();       
    }

  }
}
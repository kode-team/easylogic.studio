import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";

export default class ImageProperty extends BaseProperty {

  getTitle() {
    return 'Image'
  }

  getBody() {
    return `<div ref='$body' style='padding-top: 3px;'></div>`;
  }  

  [LOAD("$body")]() { 
    var current = editor.selection.current || {};

    var src = current['src'] || ''
    return `<ImageSelectEditor 
              ref='$1' 
              key='src' 
              value="${src}" 
              onchange="changeSelect" />`;
  }

  [EVENT('changeSelect')] (key, value) {
    var current = editor.selection.current;

    if (current) {
      current.reset({
        [key]: value
      })

      this.emit('refreshElement', current);
    }
  }

  [EVENT('refreshSelection')]() {

    var current = editor.selection.current; 

    if (current) {
      if (!current.is('image')) {
        this.hide();
      } else {

        if (this.$el.css('display') === 'none') {
          this.show();
        }

        this.refresh();
      }
    }

  }
}

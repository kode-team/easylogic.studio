import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { LOAD, DEBOUNCE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";


export default class TextClipProperty extends BaseProperty {
  
  getTitle() {
    return "Text Clip";
  }

  isFirstShow() {
    return false; 
  }

  getClassName() {
    return 'item'
  }

  getTools() {
    return `<div ref='$textClip'></div>`;
  }  

  [LOAD("$textClip")]() {
    var current = editor.selection.current || {};

    var clip = current['text-clip'] || ''
    return `<SelectEditor ref='$1' key='text-clip' icon="true" value="${clip}" options=",text" onchange="changeSelect" />`;
  }

  [EVENT('changeSelect')] (key, value) {
    var current = editor.selection.current;

    if (current) {
      current.reset({
        [key]: value
      })

      this.emit("refreshElement", current);
    }
  }



  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShow('text')
  }  
}

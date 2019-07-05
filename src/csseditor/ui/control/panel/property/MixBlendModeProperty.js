import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { LOAD, DEBOUNCE } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";


const blend_list = [
  '',
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity"
];



export default class MixBlendModeProperty extends BaseProperty {

  getTitle() {
    return "Mix Blend";
  }

  getTools() {
    return `<div ref='$mixBlend' style='padding-top: 3px;'></div>`;
  }  

  [LOAD("$mixBlend")]() {
    var current = editor.selection.current || {};

    var blend = current['mix-blend-mode'] || ''
    return `<SelectEditor ref='$1' key='mix-blend-mode' value="${blend}" options="${blend_list.join(',')}" onchange="changeSelect" />`;
  }

  [EVENT('changeSelect')] (key, value) {

    editor.selection.reset({ 
      [key]: value
    })

    this.emit("refreshSelectionStyleView");
  }


  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    var current = editor.selection.current;
    if (current) {
      if (current.is('artboard')) {
        this.hide();
      } else {
        this.show();
        this.refresh();
      }
    } else {
      this.hide();
    }

  }  
}

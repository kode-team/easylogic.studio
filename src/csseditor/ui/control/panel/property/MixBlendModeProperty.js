import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { EMPTY_STRING } from "../../../../../util/css/types";
import { LOAD, CLICK, INPUT } from "../../../../../util/Event";
import { EVENT } from "../../../../../util/UIElement";
import {
  CHANGE_EDITOR,
  CHANGE_LAYER,
  CHANGE_SELECTION,
  CHANGE_ARTBOARD
} from "../../../../types/event";

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
    var current = editor.selection.current;

    if (current) {
      current.reset({
        [key]: value
      })

      this.emit('refreshCanvas')
    }
  }

  [EVENT(CHANGE_EDITOR, CHANGE_LAYER, CHANGE_ARTBOARD, CHANGE_SELECTION)]() {
    this.refresh();
  }
}

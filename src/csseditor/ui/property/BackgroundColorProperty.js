import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { LOAD, DEBOUNCE } from "../../../util/Event";
import { EVENT } from "../../../util/UIElement";
import { Length } from "../../../editor/unit/Length";



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
].join(',');


export default class BackgroundColorProperty extends BaseProperty {

  getTitle() {
    return "Background Color";
  }

  isHideHeader() {
    return true; 
  }

  getBody() {
    return `
        <div class='property-item'>
          <ColorViewEditor ref='$color' label="color" onchange="changeColor" />
        </div>

        <div class='property-item'>
          <NumberRangeEditor 
            ref='$opacity' 
            key='opacity' 
            label='opacity'
            min="0"
            max="1"
            step="0.01"
            selected-unit=' '
            removable="true"
            onchange="changeSelect" />
        </div>
        
        <div class='property-item'>
          <RangeEditor 
            ref='$rotate' 
            key='rotate' 
            label='rotate'
            min="-360"
            max="360"
            step="0.1"
            units='deg,turn'
            removable="true"
            onchange="changeSelect" />
        </div>
        
        <div class='property-item'>
          <SelectEditor 
            label='blend'
            ref='$mixBlend' 
            key='mix-blend-mode' 
            icon="true" 
            options="${blend_list}" 
            onchange="changeSelect" />
        </div>        
      `;
  }  

  refresh () {
    var current = editor.selection.current; 

    if (current) {
      this.children.$color.setValue(current['background-color'] || 'rgba(0, 0, 0, 1)')
      this.children.$opacity.setValue(current.opacity || '1')
      this.children.$rotate.setValue(current.rotate || Length.deg(0))
      this.children.$mixBlend.setValue(current['mix-blend-mode'])
    }
  }


  [EVENT('changeSelect')] (key, value) {
    editor.selection.reset({
      [key]: value
    })

    this.emit("refreshSelectionStyleView");
  }

  [EVENT('changeColor')] (color) {
    this.trigger('changeSelect', 'background-color', color);
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)]() {
    this.refreshShowIsNot('project');
  }
}

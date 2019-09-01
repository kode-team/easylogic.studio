import BaseProperty from "./BaseProperty";
import { editor } from "../../../editor/editor";
import { EVENT } from "../../../util/UIElement";

import { DEBOUNCE } from "../../../util/Event";

const outlineStyleLit = [
  'auto',
  "none",
  "dotted",
  "dashed",
  "solid",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset"
];


export default class OutlineProperty extends BaseProperty {

  getTitle() {
    return "Outline";
  }

  isFirstShow() {
    return false;
  }

  afterRender() {
    this.refresh();
  }



  [EVENT('refreshSelection') + DEBOUNCE(100)]() {

    this.refreshShow('layer')

  }  

  getBody() {
    return /*html*/`
      <div class="property-item">
        <RangeEditor ref='$width' label='Width' min="0" max="0" value="0px" key='width' onchange='changeOutlineValue' />
      </div>
      <div class="property-item">
        <SelectEditor ref='$style' label='Style' key='style' value="none" options="${outlineStyleLit}" onchange='changeOutlineValue' />        
      </div>        
      <div class="property-item">        
        <ColorViewEditor ref='$color' key='color', onChange="changeOutlineColor" />
      </div> 
    `;
  }

  updateData (opt) {
    this.setState(opt);

    this.refreshOutlineInfo()
  }

  [EVENT('changeOutlineColor')] (key, color) {
    this.updateData({
      [key]: color
    })
  }

  [EVENT('changeOutlineValue')] (key, value) {
    this.updateData({
      [key]: value
    })
  }


  refreshOutlineInfo() {

    var current = editor.selection.current;

    if (current) {
      current.setOutline(this.state);

      this.emit('refreshElement', current);
    }
  }

}

import BaseProperty from "./BaseProperty";
import { editor } from "../../../../../editor/editor";
import { EVENT } from "../../../../../util/UIElement";
import { CHANGE_SELECTION } from "../../../../types/event";
import { DEBOUNCE } from "../../../../../util/Event";

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



  [EVENT(CHANGE_SELECTION) + DEBOUNCE(100)]() {

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

  getBody() {
    return `
      <div class="property-item">
        <RangeEditor ref='$width' label='Width' min="0" max="0" value="0px" key='width' onchange='changeOutlineValue' />
      </div>
      <div class="property-item">
        <SelectEditor ref='$style' label='Style' key='style' value="none" options="${outlineStyleLit}" onchange='changeOutlineValue' />        
      </div>        
      <div class="property-item">        
        <ColorViewEditor ref='$color' onChange="changeOutlineColor" />
      </div> 
    `;
  }

  updateData (opt) {
    this.setState(opt);

    this.refreshOutlineInfo()
  }

  [EVENT('changeOutlineColor')] (color) {
    this.updateData({
      color
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
      // ArtBoard, Layer 에 새로운 BackgroundImage 객체를 만들어보자.
      current.setOutline(this.state);

      this.emit("refreshCanvas");
    }
  }

}

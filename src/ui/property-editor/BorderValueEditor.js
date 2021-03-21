import { Length } from "@unit/Length";
import UIElement, { EVENT } from "@core/UIElement";
import Border from "@property-parser/Border";
import "./RangeEditor";
import "./SelectEditor";
import "./ColorViewEditor";
import "./InputRangeEditor";
import "./ColorSingleEditor";
import { registElement } from "@core/registerElement";


const borderStyleList = [
  "none",
  "hidden",
  "dotted",
  "dashed",
  "solid",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset"
].join(',');



export default class BorderValueEditor extends UIElement {

  initState() {

    return {
      value: Border.parseValue(this.props.value)
    }
  }

  updateData(obj) {
    this.setState(obj, false);
    this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params);  
  }

  getValue() {
    return Border.joinValue(this.state.value)
  }

  setValue(value) {
    this.state.value = Border.parseValue(value);
    this.refresh();
  }

  refresh () {

    this.children.$width.setValue(this.state.value.width || Length.z())
    this.children.$style.setValue(this.state.value.style || 'solid')
    this.children.$color.setValue(this.state.value.color || 'rgba(0, 0, 0, 1)')
  }
  

  template() {
    var {width, style, color} = this.state.value; 
    return /*html*/`
      <div class="border-value-editor">
        <div class='editor-area'>
          <object refClass="RangeEditor"  ref='$width' min="0" max="100" step="1" key='width' value="${width}" onchange='changeKeyValue' />
        </div>
        <div class='editor-area'>
          <object refClass="SelectEditor"  ref='$style' key='style' options='${borderStyleList}' value="${style || 'solid'}" onchange="changeKeyValue" />
        </div>
        <div class='editor-area'>
          <object refClass="ColorSingleEditor" ref='$color' key='color' value="${color|| 'rgba(0, 0, 0, 1)'}"  onchange="changeKeyValue" />
        </div>

      </div>
    `;
  }


  [EVENT('changeKeyValue')] (key, v) {
    var value = this.state.value;
    value[key] = v; 

    this.updateData({ value })
  }

}

registElement({ BorderValueEditor })
import { CLICK, LOAD } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import UIElement, { EVENT } from "../../../util/UIElement";
import BorderValueEditor from "./BorderValueEditor";
import Border from "../../../editor/css-property/Border";

const borderTypeList = ["border", "border-top", "border-right", "border-bottom", "border-left"]
const borderTypeTitle = {
  "border": 'Border', 
  "border-top": 'Top', 
  "border-right": 'Right', 
  "border-bottom": 'Bottom', 
  "border-left": 'Left'
}


export default class BorderEditor extends UIElement {
 
  components() {
    return {
      BorderValueEditor
    }
  }

  initState() {

    var borders = Border.parseStyle(this.props.value)
    var direction = Object.keys(borders)[0] || 'border'

    return {
      direction,
      borders
    }
  }

  updateData(obj) {
    this.setState(obj, false);
    this.parent.trigger(this.props.onchange, this.props.key, this.getValue(), this.props.params);  
  }

  getValue() {
    return Border.join(this.state.borders)
  }

  setValue(value) {
    this.state.borders = Border.parseStyle(value);
    this.refresh();
  }

  refresh () {
    this.load();

  }


  [LOAD('$editorArea')] () {
    return borderTypeList.map(type => {
      var label = borderTypeTitle[type] || type; 
      return /*html*/`
      <div>
        <BorderValueEditor ref='$${type}' label='${label}' key="${type}" value="${this.state.borders[type]}" onchange="changeKeyValue" />
      </div>
      `
    })
  }

  template() {
    return /*html*/`
      <div class="border-editor">
        <div class='header'>
          <div></div>
          <label>Width</label>
          <label>Style</label>
          <label>Color</label>
        </div>
        <div class='editor-area' ref='$editorArea'>

        </div>
      </div>
    `;
  }


  [EVENT('changeKeyValue')] (key, value) {
    var borders = this.state.borders;
    borders[key] = value; 

    this.updateData({ borders })
  }

}

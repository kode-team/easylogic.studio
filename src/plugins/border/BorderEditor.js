import { LOAD, SUBSCRIBE, SUBSCRIBE_SELF } from "el/base/Event";
import Border from "el/editor/property-parser/Border";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './BorderEditor.scss';

const borderTypeList = [
  "border", 
  // "border-top", 
  // "border-right", 
  // "border-bottom", 
  // "border-left"
]
const borderTypeTitle = {
  "border":  'all', 
  "border-top": 'top', 
  "border-right": 'right', 
  "border-bottom": 'bottom', 
  "border-left": 'left'
}


export default class BorderEditor extends EditorElement {

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

      label = this.$i18n('border.editor.' + label);
      return /*html*/`
      <div>
        <object refClass='BorderValueEditor' ref='$${type}' label='${label}' key="${type}" value="${this.state.borders[type]}" onchange="changeKeyValue" />
      </div>
      `
    })
  }

  template() {
    return /*html*/`
      <div class="elf--border-editor">
        <div class='header'>
          <div></div>
          <label>${this.$i18n('border.editor.width')}</label>
          <label>${this.$i18n('border.editor.style')}</label>
          <label>${this.$i18n('border.editor.color')}</label>
        </div>
        <div class='editor-area' ref='$editorArea'>

        </div>
      </div>
    `;
  }


  [SUBSCRIBE_SELF('changeKeyValue')] (key, value) {
    var borders = this.state.borders;
    borders[key] = value; 

    this.updateData({ borders })
  }

}
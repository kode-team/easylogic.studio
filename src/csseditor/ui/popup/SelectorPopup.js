import { EVENT } from "../../../util/UIElement";
import { INPUT } from "../../../util/Event";
import CSSPropertyEditor from "../property-editor/CSSPropertyEditor";
import BasePopup from "./BasePopup";
import { editor } from "../../../editor/editor";

export default class SelectorPopup extends BasePopup {

  getTitle() {
    return editor.i18n('selector.popup.title')
  }

  components() {
    return {
      CSSPropertyEditor
    }
  }

  initState() {
    return {
      selector: '',
      properties: []
    };
  }

  updateData(opt) {
    this.setState(opt, false); 
    this.emit("changeSelectorPopup", this.state);
  }

  getBody() {
    return `
    <div class='selector-popup' ref='$popup'>
      <div class="box">
        ${this.templateForSelector()}
        ${this.templateForProperty()}        
      </div>
    </div>`;
  }


  templateForProperty() {
    return /*html*/`<CSSPropertyEditor ref='$propertyEditor' onchange='changePropertyEditor' />`
  }    


  templateForSelector() {
    return /*html*/`
      <div class='name'>
        <label>${editor.i18n('selector.popup.selector')}</label>
        <div class='input grid-1'>
          <input type='text' value='${this.state.selector}' ref='$selector'/>
        </div>
      </div>
    `
  }

  [INPUT('$selector')] (e) {
    if (this.refs.$selector.value.match(/^[a-zA-Z0-9\:\_\-\.\b]+$/)) {
      this.updateData({selector : this.refs.$selector.value })
    } else {
      e.preventDefault()
      e.stopPropagation()
      return false;
    }
  }
  
  refresh() {
    super.refresh()

    this.refs.$selector.val(this.state.selector);
    this.children.$propertyEditor.trigger('showCSSPropertyEditor', this.state.properties);
  }

  [EVENT('changePropertyEditor')] (properties) {
    this.updateData({
      properties
    });
  }

  [EVENT("showSelectorPopup")](data) {
    this.setState(data);
    this.refresh()

    this.show(250)
  }
}

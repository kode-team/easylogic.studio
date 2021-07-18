
import { INPUT, SUBSCRIBE } from "el/base/Event";
import BasePopup from "el/editor/ui/popup/BasePopup";

import './SelectorPopup.scss';

export default class SelectorPopup extends BasePopup {

  getTitle() {
    return this.$i18n('selector.popup.title')
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
    return /*html*/`
    <div class='elf--selector-popup' ref='$popup'>
      <div class="box">
        ${this.templateForSelector()}
        ${this.templateForProperty()}        
      </div>
    </div>`;
  }


  templateForProperty() {
    return /*html*/`<object refClass="CSSPropertyEditor" ref='$propertyEditor' onchange='changePropertyEditor' />`
  }    


  templateForSelector() {
    return /*html*/`
      <div class='name'>
        <label>${this.$i18n('selector.popup.selector')}</label>
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

  [SUBSCRIBE('changePropertyEditor')] (properties) {
    this.updateData({
      properties
    });
  }

  [SUBSCRIBE("showSelectorPopup")](data) {
    this.setState(data);
    this.refresh()

    this.show(250)
  }
}

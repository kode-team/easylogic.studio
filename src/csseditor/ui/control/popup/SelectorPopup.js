import UIElement, { EVENT } from "../../../../util/UIElement";
import { Length } from "../../../../editor/unit/Length";
import { CHANGE_SELECTION } from "../../../types/event";
import { INPUT } from "../../../../util/Event";
import CSSPropertyEditor from "../panel/property-editor/CSSPropertyEditor";

export default class SelectorPopup extends UIElement {

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
    this.setState(opt, false); // 자동 로드를 하지 않음, state 만 업데이트
    this.emit("changeSelectorPopup", this.state);
  }

  template() {
    return `
    <div class='popup selector-popup' ref='$popup'>
      <div class="box">
        ${this.templateForSelector()}
        ${this.templateForProperty()}        
      </div>
    </div>`;
  }


  templateForProperty() {
    return `<CSSPropertyEditor ref='$propertyEditor' onchange='changePropertyEditor' />`
  }    


  templateForSelector() {
    return `
      <div class='name'>
        <label>Selector</label>
        <div class='input grid-1'>
          <input type='text' value='${this.state.name}' ref='$selector'/>
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
    this.load();

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

    this.$el
      .css({
        top: Length.px(110),
        right: Length.px(320),
        bottom: Length.auto,
        'z-index': 1000000
      })
      .show("inline-block");

    this.emit("hidePropertyPopup");
  }

  [EVENT(
    "hidePropertyPopup",
    CHANGE_SELECTION
  )]() {
    this.$el.hide();
  }
}

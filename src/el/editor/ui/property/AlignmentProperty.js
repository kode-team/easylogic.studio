import BaseProperty from "./BaseProperty";
import "../menu-items";
import { registElement } from "el/base/registerElement";

export default class AlignmentProperty extends BaseProperty {

  afterRender() {
    this.show();
  }

  getTitle() {
    return this.$i18n('alignment.property.title');
  }

  isHideHeader() {
    return true;
  }

  getBody() {
    return /*html*/`
      <div class="alignment-item">
        <object refClass="LeftAlign" />
        <object refClass="CenterAlign" />
        <object refClass="RightAlign" />

        <object refClass="TopAlign" />
        <object refClass="MiddleAlign" />
        <object refClass="BottomAlign" />  

        <object refClass="SameWidth" />
        <object refClass="SameHeight" />
      </div>
    `;
  }
}

registElement({ AlignmentProperty })
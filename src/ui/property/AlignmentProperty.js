import BaseProperty from "./BaseProperty";
import menuItems from "../menu-items";

export default class AlignmentProperty extends BaseProperty {
  components() {
    return menuItems
  }

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
        <span refClass="LeftAlign" />
        <span refClass="CenterAlign" />
        <span refClass="RightAlign" />

        <span refClass="TopAlign" />
        <span refClass="MiddleAlign" />
        <span refClass="BottomAlign" />  

        <span refClass="SameWidth" />
        <span refClass="SameHeight" />
      </div>
    `;
  }
}

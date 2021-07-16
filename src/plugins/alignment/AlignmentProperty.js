import BaseProperty from "el/editor/ui/property/BaseProperty";

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

        <object refClass="SameWidth" direction="bottom" />
        <object refClass="SameHeight" />
      </div>
    `;
  }
}
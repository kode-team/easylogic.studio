import BaseProperty from "./BaseProperty";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE } from "../../../util/Event";
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
      <div class="alignment-item" ref="$positionItem">
        <LeftAlign />
        <CenterAlign />
        <RightAlign />

        <TopAlign />
        <MiddleAlign />
        <BottomAlign />  

        <SameWidth />
        <SameHeight />
      </div>
    `;
  }
}

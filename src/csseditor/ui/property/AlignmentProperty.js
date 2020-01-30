import BaseProperty from "./BaseProperty";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE } from "../../../util/Event";
import { editor } from "../../../editor/editor";
import menuItems from "../menu-items";

export default class AlignmentProperty extends BaseProperty {
  components() {
    return menuItems
  }

  [EVENT('refreshSelection') + DEBOUNCE(100)] () {
    this.refreshShowIsNot(['project', 'artboard']);
  }

  getTitle() {
    return editor.i18n('alignment.property.title');
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

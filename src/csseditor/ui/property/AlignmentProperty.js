import BaseProperty from "./BaseProperty";
import LeftAlign from "../menu-items/LeftAlign";
import RightAlign from "../menu-items/RightAlign";
import TopAlign from "../menu-items/TopAlign";
import BottomAlign from "../menu-items/BottomAlign";
import CenterAlign from "../menu-items/CenterAlign";
import MiddleAlign from "../menu-items/MiddleAlign";
import { EVENT } from "../../../util/UIElement";
import { DEBOUNCE } from "../../../util/Event";
import SameHeight from "../menu-items/SameHeight";
import SameWidth from "../menu-items/SameWidth";
import { editor } from "../../../editor/editor";


export default class AlignmentProperty extends BaseProperty {
  components() {
    return {
      LeftAlign,
      RightAlign,
      TopAlign,
      BottomAlign,
      CenterAlign,
      MiddleAlign,
      SameHeight,
      SameWidth      
    }
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

        <div class='split'></div>        

        <SameWidth />
        <SameHeight />
        <CopyItem />
      </div>
    `;
  }
}

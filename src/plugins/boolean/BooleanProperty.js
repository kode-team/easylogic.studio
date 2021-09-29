import BottomAlign from "el/editor/ui/menu-items/BottomAlign";
import CenterAlign from "el/editor/ui/menu-items/CenterAlign";
import LeftAlign from "el/editor/ui/menu-items/LeftAlign";
import MiddleAlign from "el/editor/ui/menu-items/MiddleAlign";
import RightAlign from "el/editor/ui/menu-items/RightAlign";
import SameHeight from "el/editor/ui/menu-items/SameHeight";
import SameWidth from "el/editor/ui/menu-items/SameWidth";
import TopAlign from "el/editor/ui/menu-items/TopAlign";
import BaseProperty from "el/editor/ui/property/BaseProperty";
import { CLICK } from "el/sapa/Event";

import './BooleanProperty.scss';

export default class BooleanProperty extends BaseProperty {

  components() {
    return {
      LeftAlign,
      CenterAlign,
      RightAlign,
      TopAlign,
      MiddleAlign,
      BottomAlign,
      SameWidth,
      SameHeight
    }
  }

  getTitle() {
    return this.$i18n('alignment.property.title');
  }

  isHideHeader() {
    return true;
  }

  getBody() {
    return /*html*/`
      <div class="elf--boolean-item" ref="$buttons">
        <button type="button" data-value="intersection">Intersect</button>
        <button type="button" data-value="union">Union</button>
        <button type="button" data-value="difference">Difference</button>
        <button type="button" data-value="xor">Xor</button>
      </div>
    `;
  }

  [CLICK('$buttons button')] (e) {
    const command = e.$dt.attr('data-value');

    this.command("setAttributeForMulti", "change boolean operation", this.$selection.packByValue({
      "boolean-operation": command
    }))

  }
}
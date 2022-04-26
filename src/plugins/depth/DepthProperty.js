import { createComponent } from "sapa";

import "./DepthProperty.scss";

import OrderDown from "elf/editor/ui/menu-items/OrderDown";
import OrderFirst from "elf/editor/ui/menu-items/OrderFirst";
import OrderLast from "elf/editor/ui/menu-items/OrderLast";
import OrderTop from "elf/editor/ui/menu-items/OrderTop";
import { BaseProperty } from "elf/editor/ui/property/BaseProperty";

export default class DepthProperty extends BaseProperty {
  components() {
    return {
      OrderTop,
      OrderDown,
      OrderFirst,
      OrderLast,
    };
  }

  getTitle() {
    return this.$i18n("alignment.property.title");
  }

  isHideHeader() {
    return true;
  }

  getBody() {
    return /*html*/ `
      <div class="elf--depth-item">
        ${createComponent("OrderTop")}
        ${createComponent("OrderDown")}
        ${createComponent("OrderFirst")}
        ${createComponent("OrderLast")}
      </div>
    `;
  }
}

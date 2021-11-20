import OrderDown from "el/editor/ui/menu-items/OrderDown";
import OrderFirst from "el/editor/ui/menu-items/OrderFirst";
import OrderLast from "el/editor/ui/menu-items/OrderLast";
import OrderTop from "el/editor/ui/menu-items/OrderTop";
import BaseProperty from "el/editor/ui/property/BaseProperty";

import './DepthProperty.scss';

export default class DepthProperty extends BaseProperty {

  components() {
    return {
      OrderTop,
      OrderDown,
      OrderFirst,
      OrderLast,      
      OrderTop,
      OrderDown
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
      <div class="elf--depth-item">
        <object refClass="OrderTop" />
        <object refClass="OrderDown" />
        <object refClass="OrderFirst" />
        <object refClass="OrderLast" />        
      </div>
    `;
  }
}
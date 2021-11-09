import BaseProperty from "el/editor/ui/property/BaseProperty";
import OrderTop from '../../el/editor/ui/menu-items/OrderTop';
import './DepthProperty.scss';
import OrderDown from '../../el/editor/ui/menu-items/OrderDown';


export default class DepthProperty extends BaseProperty {

  components() {
    return {
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
      </div>
    `;
  }
}
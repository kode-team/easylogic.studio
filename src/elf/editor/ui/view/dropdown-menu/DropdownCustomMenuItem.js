import { isFunction, DOMDIFF, LOAD } from "sapa";

import { DropdownMenuItem } from "./DropdownMenuItem";
export class DropdownCustomMenuItem extends DropdownMenuItem {
  template() {
    return /*html*/ `<li class='custom'></li>`;
  }

  // 정해진 템플릿을 그대로 적용하기 위한 html
  getTemplateString() {
    if (isFunction(this.props.template)) {
      return this.props.template(this.$editor, this);
    }

    return this.$i18n(this.props.template);
  }

  [LOAD("$el") + DOMDIFF]() {
    return this.getTemplateString();
  }
}

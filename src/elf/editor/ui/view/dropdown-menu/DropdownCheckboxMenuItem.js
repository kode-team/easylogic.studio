import { isFunction, DOMDIFF, LOAD } from "sapa";

import { DropdownMenuItem } from "./DropdownMenuItem";

export class DropdownCheckboxMenuItem extends DropdownMenuItem {
  template() {
    return /*html*/ `<li class='checkbox'></li>`;
  }

  get checked() {
    if (isFunction(this.props.checked)) {
      return this.props.checked(this.$editor, this);
    }

    return this.props.checked;
  }

  [LOAD("$el") + DOMDIFF]() {
    return /*html*/ `
        <label>
          <input type="checkbox" ${
            this.checked ? 'checked="checked"' : ""
          } value="${this.props.value}" /> 
          ${this.$i18n(this.props.title)}
        </label>
      `;
  }
}

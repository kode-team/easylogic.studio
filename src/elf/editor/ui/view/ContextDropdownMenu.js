import { DropdownMenuList } from "./dropdown-menu/DropdownMenuList";
import { makeMenuItem } from "./dropdown-menu/makeMenuItem";
import "./DropdownMenu.scss";

export class ContextDropdownMenu extends DropdownMenuList {
  template() {
    return /*html*/ `
      <div class="dropdown-menu opened flat">
          <ul>
              ${this.props.items
                .map((child, index) =>
                  makeMenuItem(child, `${this.groupId}-${index}`)
                )
                .join("")}
          </ul>
      </div>
    `;
  }
}

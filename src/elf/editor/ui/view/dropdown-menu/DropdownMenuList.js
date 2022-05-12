import { Divider } from "./Divider";
import { DropdownCheckboxMenuItem } from "./DropdownCheckboxMenuItem";
import { DropdownCustomMenuItem } from "./DropdownCustomMenuItem";
import { DropdownDividerMenuItem } from "./DropdownDividerMenuItem";
import { DropdownLinkMenuItem } from "./DropdownLinkMenuItem";
import { DropdownMenuItem } from "./DropdownMenuItem";
import { DropdownTextMenuItem } from "./DropdownTextMenuItem";
import { makeMenuItem } from "./makeMenuItem";

import { iconUse } from "elf/editor/icon/icon";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
export class DropdownMenuList extends EditorElement {
  components() {
    return {
      Divider,
      DropdownDividerMenuItem,
      DropdownLinkMenuItem,
      DropdownTextMenuItem,
      DropdownCustomMenuItem,
      DropdownCheckboxMenuItem,
      DropdownMenuList,
      DropdownMenuItem,
    };
  }

  get groupId() {
    return `${this.props.id}-groupId`;
  }

  template() {
    return /*html*/ `
        <li class="dropdown-menu-list">
            <label>${this.$i18n(this.props.title)}</label> 
            <span>${iconUse("arrowRight")}</span>              
            <ul>
                ${this.props.items
                  .map((child, index) =>
                    makeMenuItem(child, `${this.groupId}-${index}`)
                  )
                  .join("")}
            </ul>
        </li>
      `;
  }
}

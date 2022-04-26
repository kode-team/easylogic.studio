import { LOAD, createComponent } from "sapa";

import { ToolbarMenuItem } from "./ToolbarMenuItem";

import { MenuItemType } from "elf/editor/types/editor";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { DropdownMenu } from "elf/editor/ui/view/DropdownMenu";

export default class ToolBarRenderer extends EditorElement {
  components() {
    return {
      DropdownMenu,
      ToolbarMenuItem,
    };
  }

  template() {
    return `<div class="toolbar-renderer"></div>`;
  }

  [LOAD("$el")]() {
    return this.props.items.map((item, index) => {
      return this.renderMenuItem(item, index);
    });
  }

  renderMenuItem(item, index) {
    switch (item.type) {
      case MenuItemType.LINK:
        return this.renderLink(item, index);
      case MenuItemType.DROPDOWN:
        return this.renderDropdown(item, index);
      default:
        return this.renderButton(item, index);
    }
  }

  renderButton(item, index) {
    return createComponent("ToolbarMenuItem", {
      ref: "$button-" + index,
      title: item.title,
      icon: item.icon,
      command: item.command,
      shortcut: item.shortcut,
      args: item.args,
      nextTick: item.nextTick,
      disabled: item.disabled,
      selected: item.selected,
      selectedKey: item.selectedKey,
      action: item.action,
      events: item.events,
    });
  }

  renderDropdown(item, index) {
    return createComponent(
      "DropdownMenu",
      {
        ref: "$dropdown-" + index,
        items: item.items,
        icon: item.icon,
        events: item.events,
        selected: item.selected,
        selectedKey: item.selectedKey,
        action: item.action,
        style: item.style,
        dy: 6,
      },
      [item.content]
    );
  }
}

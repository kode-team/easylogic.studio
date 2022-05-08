import { LOAD, createComponent } from "sapa";

import { ToolbarButtonMenuItem } from "../tool-bar/ToolbarButtonMenuItem";
import "./ContextMenuRenderer.scss";

import { MenuItemType } from "elf/editor/types/editor";
import { EditorElement } from "elf/editor/ui/common/EditorElement";
import { ContextDropdownMenu } from "elf/editor/ui/view/ContextDropdownMenu";

export default class ContextMenuRenderer extends EditorElement {
  checkProps(props = {}) {
    // console.log(props);
    // ToolbarItemEntity.parse(props);

    return props;
  }

  components() {
    return {
      ContextDropdownMenu,
      ToolbarButtonMenuItem,
    };
  }

  template() {
    return `<div class="elf--context-menu-renderer"></div>`;
  }

  [LOAD("$el")]() {
    return this.props.items?.map((item, index) => {
      return this.renderMenuItem(item, index);
    });
  }

  renderMenuItem(item, index) {
    switch (item.type) {
      case MenuItemType.LINK:
        return this.renderLink(item, index);
      case MenuItemType.SUBMENU:
        return this.renderMenu(item, index);
      case MenuItemType.BUTTON:
        return this.renderButton(item, index);
      case MenuItemType.DROPDOWN:
        return this.renderDropdown(item, index);
      default:
        return this.renderButton(item, index);
    }
  }

  renderButton(item, index) {
    return createComponent("ToolbarButtonMenuItem", {
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
      checked: item.checked,
      action: item.action,
      events: item.events,
      style: item.style,
    });
  }

  renderDropdown(item, index) {
    return createComponent("ContextDropdownMenu", {
      ref: "$dropdown-" + index,
      ...item,
      items: item.items,
      icon: item.icon,
      title: item.title,
      events: item.events || [],
    });
  }
}

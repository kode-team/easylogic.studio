import {
  CLICK,
  IF,
  POINTERSTART,
  SUBSCRIBE,
  LOAD,
  BIND,
  DOMDIFF,
  SUBSCRIBE_SELF,
  isFunction,
  isNotUndefined,
  Dom,
  classnames,
} from "sapa";

import { EditorElement } from "../common/EditorElement";
import { Divider } from "./dropdown-menu/Divider";
import { DropdownCheckboxMenuItem } from "./dropdown-menu/DropdownCheckboxMenuItem";
import { DropdownCustomMenuItem } from "./dropdown-menu/DropdownCustomMenuItem";
import { DropdownDividerMenuItem } from "./dropdown-menu/DropdownDividerMenuItem";
import { DropdownLinkMenuItem } from "./dropdown-menu/DropdownLinkMenuItem";
import { DropdownMenuItem } from "./dropdown-menu/DropdownMenuItem";
import { DropdownMenuList } from "./dropdown-menu/DropdownMenuList";
import { DropdownTextMenuItem } from "./dropdown-menu/DropdownTextMenuItem";
import { makeMenuItem } from "./dropdown-menu/makeMenuItem";
import "./DropdownMenu.scss";

import { iconUse } from "elf/editor/icon/icon";
import { Length } from "elf/editor/unit/Length";

export class DropdownMenu extends EditorElement {
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

  initialize() {
    super.initialize();

    const events = this.props.events || [];
    if (events.length) {
      events.forEach((event) => {
        this.on(event, () => this.refresh());
      });
    }
  }

  initState() {
    return {
      direction: this.props.direction || "left",
      opened: this.props.opened || false,
      items: this.props.items || [],
      dy: this.props.dy || 0,
    };
  }

  findItem(searchKey) {
    return this.state.items.find((it) => it.key && it.key === searchKey);
  }

  template() {
    const { direction } = this.state;
    return /*html*/ `
        <div class="${classnames("dropdown-menu", {
          opened: false,
        })}" data-direction="${direction}">
          <span class='icon' ref="$icon"></span>
          <span class='label' ref='$label'></span>
          <span class='dropdown-arrow' ref="$arrow">${iconUse(
            "keyboard_arrow_down"
          )}</span>
          <ul class="dropdown-menu-item-list" ref="$list"></ul>
          <div class="dropdown-menu-arrow">
              <svg viewBox="0 0 12 6" width="12" height="6">
                <path d="M0,6 L6,0 L12,6 "></path>
              </svg>
          </div>
      </div>
      `;
  }

  [LOAD("$icon")]() {
    return isFunction(this.props.icon)
      ? this.props.icon(this.$editor, this)
      : this.props.icon;
  }

  [BIND("$label")]() {
    return {
      innerHTML: this.props.title,
    };
  }

  [BIND("$el")]() {
    const selected = isFunction(this.props.selected)
      ? this.props.selected(this.$editor, this)
      : false;

    return {
      "data-selected": !!selected,
      style: {
        ...(this.props.style || {}),
        "--elf--dropdown-menu-width": this.props.width,
        "--elf--dropdown-menu-dy": isNotUndefined(this.props.dy)
          ? Length.px(this.props.dy)
          : 0,
      },
    };
  }

  close() {
    this.setState(
      {
        opened: false,
      },
      false
    );
    this.$el.removeClass("opened");
  }

  toggle() {
    this.setState(
      {
        opened: !this.state.opened,
      },
      false
    );
    this.$el.toggleClass("opened", this.state.opened);

    if (this.state.opened) {
      this.emit("hideDropdownMenu");
    }
  }

  get groupId() {
    return this.id + "$list";
  }

  [LOAD("$list") + DOMDIFF]() {
    return this.state.items.map((it, index) =>
      makeMenuItem(it, `${this.groupId}-${index}`)
    );
  }

  checkDropdownOpen(e) {
    const ul = Dom.create(e.target).closest("dropdown-menu-item-list");

    if (!ul) return true;

    return false;
  }

  [CLICK("$arrow") + IF("checkDropdownOpen")]() {
    this.toggle();
  }

  [CLICK("$label") + IF("checkDropdownOpen")]() {
    this.toggle();
  }

  [CLICK("$icon")]() {
    const selectedKey = isFunction(this.props.selectedKey)
      ? this.props.selectedKey(this.$editor, this)
      : this.props.selectedKey;

    const menuItem = this.findItem(selectedKey);

    if (!menuItem) {
      if (isFunction(this.props.action)) {
        this.props.action(this.$editor, this);
      }

      return;
    }

    const command = menuItem.command;
    const args = menuItem.args;
    const action = menuItem.action;
    const nextTick = menuItem.nextTick;

    // command 를 실행하고
    if (command) {
      this.$commands.emit(command, ...args);
    } else if (action && isFunction(action)) {
      this.emit(action);
    }

    // nextTick 은 액션처럼 실행하고
    if (nextTick && isFunction(nextTick)) {
      this.nextTick(() => {
        nextTick(this.$editor);
      });
    }

    // 닫고
    this.close();
  }

  [SUBSCRIBE_SELF("updateMenuItems")](items) {
    this.setState({ items });
  }

  [SUBSCRIBE("hideDropdownMenu")]() {
    this.close();
  }

  [POINTERSTART("document")](e) {
    const $target = Dom.create(e.target);

    const $dropdown = $target.closest("dropdown-menu");

    if (!$dropdown) {
      this.close();
    } else if ($dropdown.el !== this.$el.el) {
      this.close();
    }
  }
}

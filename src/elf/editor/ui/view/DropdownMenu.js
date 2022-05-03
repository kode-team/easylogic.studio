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
  createComponent,
  isArray,
  isString,
  classnames,
  STOP,
  PREVENT,
} from "sapa";

import { EditorElement } from "../common/EditorElement";
import "./DropdownMenu.scss";

import { iconUse } from "elf/editor/icon/icon";
import { Length } from "elf/editor/unit/Length";

function makeMenuItem(it, id) {
  if (it === "-") {
    return createComponent("Divider", {
      ref: `${id}-divider`,
    });
  }

  if (it === "-" || it.type === "divider") {
    return createComponent("DropdownDividerMenuItem", {
      ref: `${id}-divider`,
    });
  }

  if (isString(it)) {
    return createComponent("DropdownTextMenuItem", {
      text: it,
      ref: `${id}-text`,
    });
  }

  if (it.type === "link") {
    return createComponent("DropdownLinkMenuItem", {
      href: it.href,
      target: it.target,
      title: it.title,
      closable: it.closable,
      ref: `${id}-link`,
    });
  }

  if (it.type === "custom") {
    return createComponent("DropdownCustomMenuItem", {
      action: it.action,
      command: it.command,
      args: it.args,
      icon: it.icon,
      text: it.text,
      events: it.events,
      template: it.template,
      closable: it.closable,
      ref: `${id}-custom`,
    });
  }

  if (it.type === "checkbox") {
    return createComponent("DropdownCheckboxMenuItem", {
      checked: it.checked,
      command: it.command,
      args: it.args || [],
      disabled: it.disabled,
      direction: it.direction,
      icon: it.icon,
      nextTick: it.nextTick,
      onClick: it.onClick,
      action: it.action,
      shortcut: it.shortcut,
      title: it.title,
      key: it.key,
      events: it.events,
      closable: it.closable,
      items: it.items || [],
      ref: `${id}-checkbox`,
    });
  }

  if (isArray(it.items)) {
    return createComponent("DropdownMenuList", {
      title: it.title,
      items: it.items,
      ref: `${id}-list`,
    });
  }

  return createComponent("DropdownMenuItem", {
    checked: it.checked,
    command: it.command,
    args: it.args || [],
    disabled: it.disabled,
    direction: it.direction,
    icon: it.icon,
    nextTick: it.nextTick,
    onClick: it.onClick,
    action: it.action,
    shortcut: it.shortcut,
    title: it.title,
    key: it.key,
    events: it.events,
    closable: it.closable,
    items: it.items || [],
    ref: `${id}-menu-item`,
  });
}

function Divider() {
  return /*html*/ `<li class="dropdown-divider"></li>`;
}

function DropdownDividerMenuItem() {
  return /*html*/ `<li class="dropdown-divider"></li>`;
}

function DropdownTextMenuItem() {
  return /*html*/ `<li class='text'><label>${this.$i18n(
    this.props.text
  )}</label></li>`;
}

function DropdownLinkMenuItem() {
  return /*html*/ `<li>
      <a href="${this.props.href}" target="${
    this.props.target || "_blank"
  }">${this.$i18n(this.props.title)}</a>
    </li>`;
}

class DropdownMenuList extends EditorElement {
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

class DropdownMenuItem extends EditorElement {
  initialize() {
    super.initialize();

    const events = this.props.events || [];
    if (events.length) {
      events.forEach((event) => {
        this.on(event, () => this.refresh());
      });
    }
  }

  template() {
    const it = this.props;

    const checked = isFunction(it.checked) ? it.checked(this.$editor) : "";
    return /*html*/ `
        <li data-has-children="${Boolean(it.items?.length)}"
          ${it.disabled ? "disabled" : ""} 
          ${it.shortcut ? "shortcut" : ""}
          ${checked ? `"checked=checked"` : ""}
        >
            <span class="icon">${
              checked ? iconUse("check") : it.icon || ""
            }</span>
            <div class='menu-item-text'>
              <label>${this.$i18n(it.title)}</label>
              <kbd class="shortcut">${it.shortcut || ""}</kbd>
            </div>
        </li>
      `;
  }

  [CLICK("$el") + PREVENT + STOP]() {
    if (this.props.command) {
      this.emit(this.props.command, ...(this.props.args || []));
    } else if (isFunction(this.props.action)) {
      this.props.action(this.$editor, this);
    } else if (isFunction(this.props.onClick)) {
      this.props.action(this.$editor, this);
    }

    if (isFunction(this.props.nextTick)) {
      this.nextTick(() => {
        this.props.nextTick(this.$editor, this);
      });
    }

    if (this.props.closable) {
      this.parent.close();
    }
  }
}

class DropdownCheckboxMenuItem extends DropdownMenuItem {
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

class DropdownCustomMenuItem extends DropdownMenuItem {
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
      this.emit(command, ...args);
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

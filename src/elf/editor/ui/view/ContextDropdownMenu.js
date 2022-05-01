import {
  CLICK,
  LOAD,
  DOMDIFF,
  isFunction,
  createComponent,
  isArray,
  isString,
  STOP,
  PREVENT,
} from "sapa";

import { EditorElement } from "../common/EditorElement";
import "./DropdownMenu.scss";

import { iconUse } from "elf/editor/icon/icon";

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
          ${
            this.props.title
              ? `<label>${this.$i18n(this.props.title)}</label>`
              : ""
          } 
          ${this.props.title ? `<span>${iconUse("arrowRight")}</span>` : ""}
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

import { createComponent, isString, isArray } from "sapa";
export function makeMenuItem(it, id) {
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

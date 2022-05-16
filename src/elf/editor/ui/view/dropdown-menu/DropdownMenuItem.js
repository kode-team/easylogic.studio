import { isFunction, CLICK, PREVENT, STOP } from "sapa";

import { iconUse } from "elf/editor/icon/icon";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export class DropdownMenuItem extends EditorElement {
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

    const checked = isFunction(it.checked)
      ? it.checked(this.$editor)
      : it.checked;
    return /*html*/ `
          <li data-has-children="${Boolean(it.items?.length)}"
            ${it.disabled ? "disabled" : ""} 
            ${it.shortcut ? "shortcut" : ""}
            ${checked ? `checked` : ""}
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
    console.log("click", this.props.command, this.props.args);
    if (this.props.command) {
      this.$commands.emit(this.props.command, ...(this.props.args || []));
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

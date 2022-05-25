import { BIND, CLICK, DOMDIFF, LOAD, isFunction } from "sapa";

import "./ToolbarMenuItem.scss";

import { iconUse } from "elf/editor/icon/icon";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

/**
 * @class ToolbarMenuItem
 *
 * props {
 *  title: string;  // 제목
 *  icon: string;   // 아이콘
 *  command: string;    // 커맨드 이름
 *  args: any[];        // 커맨드 매개변수
 *  shortcut: string;   // 단축키
 *  nextTick: function;  // nextTick
 *  disabled: boolean;  // disabled 상태 추가
 *  selected?: function;
 *  selectedKey: string;
 *  action: function;
 *  checked: boolean|function;
 *  events: string[];
 *  style: object;
 * }
 *
 */
export class ToolbarButtonMenuItem extends EditorElement {
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
    let tooltip = this.props.tooltip
      ? `data-tooltip="${this.props.tooltip}"`
      : "";

    return /*html*/ `<button type="button"  class='elf--toolbar-menu-item' ${tooltip}></button>`;
  }

  [CLICK("$el")]() {
    if (this.props.command) {
      this.$commands.emit(this.props.command, ...(this.props.args || []));
    } else if (isFunction(this.props.action)) {
      this.props.action(this.$editor, this);
    } else if (isFunction(this.props.onClick)) {
      this.props.onClick(this.$editor, this);
    }

    if (isFunction(this.props.nextTick)) {
      this.props.nextTick(this.$editor);
    }
  }

  [LOAD("$el") + DOMDIFF]() {
    let result = "";

    if (this.props.icon) {
      result += `<span class="icon">${iconUse(this.props.icon)}</span>`;
    }

    if (this.props.title) {
      result += `<span class="title">${this.props.title}</span>`;
    }

    return result;
  }

  [BIND("$el")]() {
    const selected = isFunction(this.props.selected)
      ? this.props.selected(this.$editor)
      : false;

    const disabled = isFunction(this.props.disabled)
      ? this.props.disabled(this.$editor)
      : this.props.disabled;

    return {
      style: {
        ...this.props.style,
      },
      "data-selected": selected,
      disabled: disabled,
    };
  }
}

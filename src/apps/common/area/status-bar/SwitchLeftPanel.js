import { CLICK } from "sapa";

import "./SwitchLeftPanel.scss";

import { iconUse } from "elf/editor/icon/icon";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class SwitchLeftPanel extends EditorElement {
  template() {
    return /*html*/ `
            <button class="elf--switch-left-panel" data-tooltip="Toggle left panel" data-direction="top left">${iconUse(
              "switch_left"
            )}</button>
        `;
  }

  [CLICK()]() {
    this.$config.toggle("show.left.panel");
  }
}

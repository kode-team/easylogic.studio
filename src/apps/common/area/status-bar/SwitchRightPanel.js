import { CLICK } from "sapa";

import "./SwitchRightPanel.scss";

import { iconUse } from "elf/editor/icon/icon";
import { EditorElement } from "elf/editor/ui/common/EditorElement";

export default class SwitchRightPanel extends EditorElement {
  template() {
    return /*html*/ `
            <button class="elf--switch-right-panel" data-tooltip="Toggle right panel" data-direction="top right">${iconUse(
              "switch_right"
            )}</button>
        `;
  }

  [CLICK()]() {
    this.$config.toggle("show.right.panel");
  }
}

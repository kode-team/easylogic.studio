import { CLICK } from "el/sapa/Event";
import icon, { iconUse } from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './SwitchRightPanel.scss';

export default class SwitchRightPanel extends EditorElement {

    template () {
        return /*html*/`
            <button class="elf--switch-right-panel" data-tooltip="Toggle right panel" data-direction="top right">${iconUse("switch_right")}</button>
        `
    }

    [CLICK()] () {
        this.$config.toggle('show.right.panel');
    }
}
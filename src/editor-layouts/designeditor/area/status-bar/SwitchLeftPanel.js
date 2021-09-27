import { CLICK } from "el/sapa/Event";
import icon, { iconUse } from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";

import './SwitchLeftPanel.scss';

export default class SwitchLeftPanel extends EditorElement {

    template () {
        return /*html*/`
        <button class="elf--switch-left-panel" data-tooltip="Toggle left panel" data-direction="top left">${iconUse("left_hide")}</button>
        `
    }

    [CLICK()] () {
        this.$config.toggle('show.left.panel');
    }
}
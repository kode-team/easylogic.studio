import { css } from "@emotion/css";
import { CLICK } from "el/base/Event";
import icon from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";

export default class SwitchLeftPanel extends EditorElement {

    template () {
        return /*html*/`
        <button class="${css`
            display: inline-block;
            position: relative;
        `}" data-tooltip="Toggle left panel" data-direction="top left">${icon.left_hide}</button>
        `
    }

    [CLICK()] () {
        this.$config.toggle('show.left.panel');
    }
}
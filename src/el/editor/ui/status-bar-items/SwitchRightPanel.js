import { css } from "@emotion/css";
import { CLICK } from "el/base/Event";
import { registElement } from "el/base/registElement";
import icon from "el/editor/icon/icon";
import { EditorElement } from "../common/EditorElement";

export default class SwitchRightPanel extends EditorElement {

    template () {
        return /*html*/`
        <button class="${css`
            display: inline-block;
            position: relative;
        `}" data-tooltip="Toggle right panel" data-direction="top right">${icon.right_hide}</button>
        `
    }

    [CLICK()] () {
        this.$config.toggle('show.right.panel');
    }
}

registElement({ SwitchRightPanel })
import { css } from "@emotion/css";
import { CLICK } from "el/base/Event";
import { registElement } from "el/base/registElement";
import icon from "el/editor/icon/icon";
import { EditorElement } from "../common/EditorElement";

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

registElement({ SwitchLeftPanel })
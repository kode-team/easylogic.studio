import BaseWindow from "./BaseWindow";

import { CLICK, SUBSCRIBE } from "el/sapa/Event";
import Dom from "el/sapa/functions/Dom";
import { registElement } from "el/sapa/functions/registElement";

import './ExportWindow.scss';
import { start } from "el/sapa/App";
import App from "../../../../editor-layouts/designeditor";

export default class EmbedEditorWindow extends BaseWindow {

    getClassName() {
        return 'elf--export-window'
    }

    getTitle() {
        return 'Mini Editor'
    }

    initState() {
        return {
            selectedIndex: 1
        }
    }

    refresh() {

        if (this.$el.isShow()) {
            App.createDesignEditor({
                container: this.refs.$body.el,
                config: {
                    'editor.design.mode': 'item',
                }
            })
        }
    }

    getBody() {
        return /*html*/`
        <div class="test" ref="$body">

      </div>
        `
    }

    [SUBSCRIBE('showEmbedEditorWindow')] () {
        this.show();
        this.refresh();
    }

}

registElement({ EmbedEditorWindow })
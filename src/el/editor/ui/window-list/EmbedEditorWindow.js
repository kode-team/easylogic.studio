import BaseWindow from "./BaseWindow";

import { registElement } from "el/sapa/functions/registElement";
import { SUBSCRIBE } from 'el/sapa/Event';
import './ExportWindow.scss';
import { createDesignEditor } from "editor-layouts/";


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
            createDesignEditor({
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
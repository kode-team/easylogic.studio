import { iconUse } from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { BIND, CLICK, DOMDIFF, LOAD } from "el/sapa/Event";
import { isFunction } from "el/sapa/functions/func";

import './ToolbarMenuItem.scss';

export class ToolbarMenuItem extends EditorElement {

    initialize () {
        super.initialize();

        const events = this.props.events || [];
        if (events.length) {
            events.forEach(event => {
                this.on (event, () => this.refresh())
            });
        }

    }

    template() {
        return /*html*/`
        <button type="button"  class='elf--toolbar-menu-item' >
            <span class="icon" ref="$icon"></span>
        </button>
        `
    }

    [CLICK('$el')] (e) {
        if (this.props.command) {
            this.emit(this.props.command, ...this.props.args);
        } else if (this.props.action) {
            this.props.action(this.$editor);
        }

    }

    [LOAD('$icon') + DOMDIFF] () {
        return iconUse(this.props.icon);
    }

    [BIND('$el')]() {

        const selected = isFunction(this.props.selected) ? this.props.selected(this.$editor) : false
        return {
            'data-selected': selected,
        }
    }
}
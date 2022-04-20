import { iconUse } from "el/editor/icon/icon";
import { EditorElement } from "el/editor/ui/common/EditorElement";
import { BIND, CLICK, DOMDIFF, LOAD } from "el/sapa/Event";
import { isFunction } from "el/sapa/functions/func";

import './ToolbarMenuItem.scss';

/**
 * @class ToolbarMenuItem
 * 
 * props {
 *  title: string;  // 제목 
 *  icon: string;   // 아이콘 
 *  command: string;    // 커맨드 이름 
 *  args: any[];        // 커맨드 매개변수  
 *  shortcut: string;   // 단축키 
 *  nextTick: boolean;  // nextTick
 *  disabled: boolean;  // disabled 상태 추가 
 *  selected?: function;
 *  selectedKey: string;
 *  action: function;
 *  events: string[];
 * }
 * 
 */
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
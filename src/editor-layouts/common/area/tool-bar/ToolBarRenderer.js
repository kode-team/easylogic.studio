import { EditorElement } from "el/editor/ui/common/EditorElement";
import { LOAD } from 'el/sapa/Event';
import { variable } from "el/sapa/functions/registElement";
import { DropdownMenu } from 'el/editor/ui/view/DropdownMenu';
import { ToolbarMenuItem } from './ToolbarMenuItem';
import { createComponent } from "el/sapa/functions/jsx";


export default class ToolBarRenderer extends EditorElement {

    components() {
        return {
            DropdownMenu,
            ToolbarMenuItem
        }
    }

    template() {
        return `<div class="toolbar-renderer"></div>`
    }

    [LOAD('$el')]() {
        return this.props.items.map((item, index) => {
            return this.renderMenuItem(item, index);
        })
    }

    renderMenuItem(item, index) {
        switch (item.type) {
            case 'link':
                return this.renderLink(item, index);
            case 'menu':
                return this.renderMenu(item, index);
            case 'button':
                return this.renderButton(item, index);
            case 'dropdown':
                return this.renderDropdown(item, index);
            default:
                return this.renderButton(item, index);
        }
    }

    renderButton(item, index) {
        return createComponent("ToolbarMenuItem", {
            ref: "$button-" + index,
            title: item.title,
            icon: item.icon,
            command: item.command,
            shortcut: item.shortcut,
            args: item.args,
            nextTick: item.nextTick,
            disabled: item.disabled,
            selected: item.selected,
            selectedKey: item.selectedKey,
            action: item.action,
            events: item.events,
        });
    }

    renderDropdown(item, index) {
        return createComponent("DropdownMenu", {
            ref: "$dropdown-" + index,
            items: item.items,
            icon: item.icon,
            events: item.events,
            selected: item.selected,
            selectedKey: item.selectedKey,
            action: item.action,
            style: item.style,
            dy: 6
        }, [
            item.content
        ])
    }
}
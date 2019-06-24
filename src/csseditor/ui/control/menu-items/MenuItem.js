import UIElement from "../../../../util/UIElement";
import { CLICK } from "../../../../util/Event";


const DEFAULT_TITLE = '';
const DEFAULT_ICON = ''; 
const DEFAULT_CHECKED = false; 

export default class MenuItem extends UIElement {
    template () {
        return `
            <button type="button" class='menu-item' checked="${this.getChecked() ? 'checked' : ''}">
                <div class="icon ${this.getIcon()}">${this.getIconString()}</div>
                <div class="title">${this.getTitle()}</div>
            </button>
        `
    }

    clickButton(e) {}

    getChecked () {
        return DEFAULT_CHECKED; 
    }

    getTitle () {
        return DEFAULT_TITLE;
    }

    getIcon () { 
        return DEFAULT_ICON; 
    }

    getIconString() {
        return DEFAULT_ICON;
    }

    [CLICK()] (e) {
        this.clickButton(e);
    }
}
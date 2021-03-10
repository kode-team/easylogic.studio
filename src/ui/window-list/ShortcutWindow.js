import BaseWindow from "./BaseWindow";
import shortcuts from "../../shortcuts";
import { os } from "@core/functions/detect";
import { EVENT } from "@core/UIElement";
import { registElement } from "@core/registerElement";

const categories = new Set();

shortcuts.forEach(it => {
    categories.add(it.category)
})

const keys = {}

categories.forEach(it => {
    shortcuts.filter(item => item.category === it).forEach(item => {
        if (!keys[item.category]) {
            keys[item.category] = []
        }

        keys[item.category].push(item);
    })  
})

const keyAlias = {
    'ARROWRIGHT': '→',
    'ARROWLEFT': '←',
    'ARROWUP': '↑',
    'ARROWDOWN': '→',
    'BACKSPACE': '⌫',
    'CMD': '⌘',
}

const OSName = os()

export default class ShortcutWindow extends BaseWindow {

    getClassName() {
        return 'shortcut-window'
    }

    getTitle() {
        return 'ShortCuts'
    }

    getKeyString (os, item) {
        return (item[os] || item.key).split('+').map(it => it.trim()).map(it => {
            const keyString = it.toUpperCase();
            return /*html*/`<span>${keyAlias[keyString] || keyString}</span>`
        }).join(' + ')
    }

    getTemplateForShortcutItem (item) {
        return /*html*/`
            <div class='shortcut-view-item'>
                <div class='title'>${item.description}</div>
                <div class='os-item'>${this.getKeyString(OSName, item)}</div>
            </div>                        
        `
    }

    getTemplateForCategory (category, list = []) {
        return /*html*/`
            <div class='item'>
                <h2>${category}</h2>
                <div>
                    ${list.map(it => this.getTemplateForShortcutItem(it)).join('')}
                </div>
            </div>
        `
    }

    getTemplateForLayer () {
        return /*html*/`
            <div class='item'>
                <h2>Layer</h2>
                <div>
                    <div class='shortcut-view-item'>
                        <div class='title'>
                            Add Rect
                            <span class='description'>fdsafdsfdf</span>
                        </div>

                        <div class='os-item mac'><span>CTRL</span>+<span>R</span></div>
                        <div class='os-item win'>R</div>
                        <div class='os-item linux'>R</div>
                    </div>
                </div>
            </div>
        `
    }

    getBody() {
        return /*html*/`
        <div class="list">
            ${Object.keys(keys).map(category => {
                return this.getTemplateForCategory(category, keys[category])
            }).join('')}
        </div>
        `
    }

    [EVENT('showShortcutWindow')] () {
        this.show();
    }

}

registElement({ ShortcutWindow })
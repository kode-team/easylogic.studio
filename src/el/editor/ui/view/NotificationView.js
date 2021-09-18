
import icon from "el/editor/icon/icon";
import Dom from "el/sapa/functions/Dom";
import { TRANSITIONEND, CLICK, SUBSCRIBE } from "el/sapa/Event";
import { EditorElement } from "../common/EditorElement";

import './NotificationView.scss'

export default class NotificationView extends EditorElement {

    template() {
        return /*html*/`
            <div class='elf--notification-view'>
            </div>
        `
    }

    [TRANSITIONEND('$el')] (e) {
        Dom.create(e.target).remove();
    }

    [CLICK('$el .item > .icon')] (e) {
        e.$dt.parent().remove();
    }

    getMessageTemplate (type, title, description, duration = 1000) {
        return /*html*/`
        <div class='item ${type}' style='transition-duration: ${duration}ms;'>
            <div class='title'>${title}</div> 
            <div class='description'>${description}</div>
            <span class='icon'>${icon.close}</span>
        </div>
    `
    }

    [SUBSCRIBE('notify')] (type, title, description, duration = 1000) {
        const $dom = Dom.createByHTML(this.getMessageTemplate(type, title, description, 1000))
    
        this.$el.prepend($dom)

        setTimeout(($dom) => {
            $dom.css('opacity', 0);
        }, duration, $dom)

    }
}
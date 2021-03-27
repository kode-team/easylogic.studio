import UIElement, { EVENT } from "@sapa/UIElement";
import icon from "@icon/icon";
import Dom from "@sapa/Dom";
import { TRANSITIONEND, CLICK } from "@sapa/Event";
import { registElement } from "@sapa/registerElement";

export default class NotificationView extends UIElement {

    template() {
        return /*html*/`
            <div class='notification-view'>
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

    [EVENT('notify')] (type, title, description, duration = 1000) {
        const $dom = Dom.createByHTML(this.getMessageTemplate(type, title, description, duration))
    
        this.$el.prepend($dom)

        setTimeout(($dom) => {
            $dom.css('opacity', 0);
        }, 100, $dom)

    }
}

registElement({ NotificationView })
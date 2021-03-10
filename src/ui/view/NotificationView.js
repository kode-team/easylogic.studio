import UIElement, { EVENT } from "@core/UIElement";
import icon from "@icon/icon";
import Dom from "@core/Dom";
import { TRANSITIONEND, CLICK } from "@core/Event";
import { registElement } from "@core/registerElement";

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

    getMessageTemplate (type, title, description, duration = 2000) {
        return /*html*/`
        <div class='item ${type}' style='transition-duration: ${duration}ms;'>
            <div class='title'>${title}</div> 
            <div class='description'>${description}</div>
            <span class='icon'>${icon.close}</span>
        </div>
    `
    }

    [EVENT('notify')] (type, title, description, duration = 2000) {
        const $dom = Dom.createByHTML(this.getMessageTemplate(type, title, description, duration))
    
        this.$el.prepend($dom)

        setTimeout(($dom) => {
            $dom.css('opacity', 0);
        }, 100, $dom)

    }
}

registElement({ NotificationView })
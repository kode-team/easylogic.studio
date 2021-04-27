
import icon from "el/editor/icon/icon";
import Dom from "el/base/Dom";
import { TRANSITIONEND, CLICK, SUBSCRIBE } from "el/base/Event";
import { registElement } from "el/base/registElement";
import { EditorElement } from "../common/EditorElement";

export default class NotificationView extends EditorElement {

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

    [SUBSCRIBE('notify')] (type, title, description, duration = 1000) {
        const $dom = Dom.createByHTML(this.getMessageTemplate(type, title, description, duration))
    
        this.$el.prepend($dom)

        setTimeout(($dom) => {
            $dom.css('opacity', 0);
        }, 100, $dom)

    }
}

registElement({ NotificationView })
import { registElement } from "@sapa/registerElement";
import UIElement from "@sapa/UIElement";
import "./KeyframeTimeControl";

export default class TimelineTopToolbar extends UIElement {
    template() {
        return /*html*/`
            <div class='timeline-top-toolbar'>
                <object refClass="KeyframeTimeControl" />
            </div>
        `
    }
}

registElement({ TimelineTopToolbar })